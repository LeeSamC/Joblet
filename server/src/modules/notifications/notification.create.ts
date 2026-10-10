import { notifications } from "../../db/schema"
import { db } from "../../db"


interface CreateNotificationParams {
    recipientId: string
    actorId: string
    type: string
    applicationId: string | null
    requestId: string | null
}

export const createNotification = async ({recipientId, actorId, type, applicationId = null, requestId = null }: CreateNotificationParams) => {
    if(recipientId === actorId){
        return
    }

    await db.insert(notifications).values({
        recipientId,
        actorId,
        type,
        applicationId,
        requestId
    })
}