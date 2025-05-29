from typing import List
import mailtrap as mt
import requests
from src.config import Config


class MailData:
    emails = List[mt.Address]
    subject: str
    message: str

    def __init__(self, recipients: List[str], subject: str, message: str):
        self.subject = subject
        self.message = message
        self.emails = []

        for recipient in recipients:
            self.emails.append(mt.Address(email=recipient))


class NotificationService:
    @staticmethod
    def send_email(data: MailData):
        try:
            # create mail object
            mail = mt.Mail(
                sender=mt.Address(
                    email=Config.MAIL_SENDER_EMAIL, name=Config.MAIL_SENDER_NAME
                ),
                to=data.emails,
                subject=data.subject,
                html=data.message,
                # text="Congrats for sending test email with Mailtrap!",
            )

            # create client and send
            client = mt.MailtrapClient(token=Config.MAILTRAP_TOKEN)
            client.send(mail)
            print("mail sent...")
        except Exception as e:
            print(e)
        finally:
            print("mail function called...")

    @staticmethod
    def send_sms(telephone: str, message: str) -> None:
        response = requests.post(
            url="https://api.smslive247.com/api/v4/sms",
            json={
                "senderID": "CORPMAN",
                "messageText": message,
                "route": "dnd",
                "mobileNumber": telephone,
            },
            headers={
                "accept": "application/json",
                "content-type": "application/*+json",
                "Authorization": Config.SMS_LIVE_247_KEY,
            },
        )
        print(response.json())
        print(response.text)
