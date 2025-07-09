"use client";
import { fetchAuthSession } from 'aws-amplify/auth';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import Lambda from 'aws-sdk/clients/lambda';
import outputs from '../amplify-outputs.json'

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

const invocation = async () => {
  const { credentials } = await fetchAuthSession();
  const client = new LambdaClient({
    credentials,
    region: outputs.auth.aws_region,
  });
  const cmd = new InvokeCommand({
    FunctionName: 'Kirktest',
    Payload: '{}',
  });
  const resp = await client.send(cmd);
  const body = JSON.parse(new TextDecoder().decode(resp.Payload!));
  console.log(body);
}

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const testLambda = new Lambda();
  const testFunc = () => testLambda.invoke({
    FunctionName: 'Kirktest',
    Payload: {}
  })
  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <button onClick={invocation}>+ old</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}
