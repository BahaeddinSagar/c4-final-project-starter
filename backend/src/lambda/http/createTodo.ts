import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { todoBuilder } from '../../businesslogic/todos'
import { createToDo } from '../../datalayer/todosAcess'



export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    console.log(newTodo)
    const todo = todoBuilder(newTodo,event)
    
    const createdToDO = await  createToDo(todo)

    
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: createdToDO
    })
  }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
