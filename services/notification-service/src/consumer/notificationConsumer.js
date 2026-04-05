import amqp from "amqplib";
import notificationService from "../services/notificationService";

async function consume() {
    const connection = await amqp.connect("amqp://rabbitmq");
    const channel = await connection.createChannel();

    const queue = "appointment_notifications";
    await channel.assertQueue(queue);

    channel.consume(queue, async (msg) => {
        const data = JSON.parse(msg.content.toString());

        await notificationService.sendEmail(
            data.email,
            "Appointment Confirmed",
            data.message
        );

        await notificationService.sendSMS(
            data.phone,
            data.message
        );

        channel.ack(msg);
    });
}

consume();