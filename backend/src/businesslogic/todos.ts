//import { TodosAccess } from './todosAcess'
//import { AttachmentUtils } from './attachmentUtils';
//import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
//import * as createError from 'http-errors'
import {v4 as uuidv4} from 'uuid';
import { getUserId } from '../lambda/utils';
import { APIGatewayProxyEvent } from 'aws-lambda';

// TODO: Implement businessLogic
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;

export function todoBuilder(newTodo: CreateTodoRequest, event: APIGatewayProxyEvent ){

    const todoId = uuidv4();
    const userId = getUserId(event)
    const todo = {
      todoId: todoId,
      userId: userId,
      createdAt: new Date().toISOString(),
      done: false,
      attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
      ...newTodo
    }

    return todo
}