import { AppSyncResolverEvent } from "aws-lambda"

export const handler = async (event: AppSyncResolverEvent<any>) => {
  console.log(event)
  return 'hello world'
}