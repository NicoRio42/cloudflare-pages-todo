import { html } from "../lib/html";
import { htmlResponse } from "../lib/http/html-response";
import { BaseLayout } from "../lib/layouts/Base";
import { Todo } from "../lib/models/todo.model";

interface Env {
  todo_d1_db: D1Database;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === "GET") {
    const { success, results } = await env.todo_d1_db
      .prepare("select * from todo")
      .all();

    if (!success) {
      return new Response(null, { status: 500 });
    }

    const todos = results as unknown as Todo[];

    return htmlResponse(
      BaseLayout(
        "Cloudflare pages todo app",
        html`
          <h1>Trying to build a todo app only with cloudflare pages</h1>
          <p>Blablabla</p>

          <ul>
            ${todos
              .map(
                (todo) => html`
                  <li>${todo.description} ${todo.done ? "done" : "todo"}</li>
                `
              )
              .join("")}
          </ul>

          <form method="post">
            <input name="new-todo" />

            <button>Add new todo</button>
          </form>
        `
      )
    );
  }

  if (request.method === "POST") {
    const formadata = await request.formData();
    const newTodo = formadata.get("new-todo");

    if (typeof newTodo !== "string") {
      return new Response("Bad request", { status: 400 });
    }

    const id = crypto.randomUUID();

    const { success } = await env.todo_d1_db
      .prepare("INSERT INTO todo VALUES (?, ?, ?)")
      .bind(id, newTodo, 0)
      .run();

    if (!success) {
      return new Response(null, { status: 500 });
    }

    return new Response(null, { status: 302, headers: { Location: "/" } });
  }

  return new Response("Bad request", { status: 400 });
};
