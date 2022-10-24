import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
//import { TodoUpdate } from '../models/TodoUpdate';


const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')


    const docClient: DocumentClient = createDynamoDBClient()
    const todosTable = process.env.TODOS_TABLE
    const todoTableIndex = process.env.TODOITEM_TABLE_INDEX
// TODO: Implement the dataLayer logic

export async function createToDo (todo: TodoItem): Promise<TodoItem> {

   
    logger.info("Creating new todo item:", todo);

    
    await docClient.put({
      TableName: todosTable,
      Item: todo
    }).promise()

    logger.info("Create complete.")

    return todo
  }

export async function getAlltodos(userid: string): Promise<TodoItem[]> {
  
  const params = {
    TableName: todosTable,
    IndexName: todoTableIndex,
    KeyConditionExpression: "#userId = :userId",
    ExpressionAttributeNames: {
        "#userId": "userId"
    },
    ExpressionAttributeValues: {
        ":userId": userid
    }
};

  logger.info("Reading todo items:", params);

  const result = await docClient.query(params).promise()
  const items = result.Items
  logger.info("got items.", items)
  return items as TodoItem[]

}

export async function deleteToDo (todoId: string, userId: string): Promise<string> {
  
  const params = {
    TableName: this.todoTable,
    Key: {
        "userId": userId,
        "todoId": todoId
    },
};

const result = await this.docClient.delete(params).promise();
logger.info(result)
return result.statusCode 

}

export async function updateTodo(updatedTodo:TodoUpdate, todoId : string, userId:string) : Promise<TodoUpdate> {
  
  const params = {
    TableName: this.todoTable,
    Key: {
        "userId": userId,
        "todoId": todoId
    },
    UpdateExpression: "set #a = :a, #b = :b, #c = :c",
    ExpressionAttributeNames: {
        "#a": "name",
        "#b": "dueDate",
        "#c": "done"
    },
    ExpressionAttributeValues: {
        ":a": updatedTodo['name'],
        ":b": updatedTodo['dueDate'],
        ":c": updatedTodo['done']
    },
    ReturnValues: "ALL_NEW"
};
    const result = await this.docClient.update(params).promise();
        console.log(result);
        const attributes = result.Attributes;

        return attributes as TodoUpdate;
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }