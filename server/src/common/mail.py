from typing import List
import mailtrap as mt
from src.config import Config
import requests

# email_templates: dict[str, str] = {"sign_up": "", "verify_email": ""}


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


def sendMail(data: MailData):
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


def send_simple_message():
    try:
        result = requests.post(
            "https://api.mailgun.net/v3/sandbox7a884f4a9f5c4966958854eddd237895.mailgun.org/messages",
            auth=("api", Config.MAIL_GUN_API_KEY),
            data={
                "from": "Mailgun Sandbox <postmaster@sandbox7a884f4a9f5c4966958854eddd237895.mailgun.org>",
                "to": "Owhiroro Cleave <owhiroroeghele@gmail.com>",
                "subject": "Hello Owhiroro Cleave",
                "text": "Congratulations Owhiroro Cleave, you just sent an email with Mailgun! You are truly awesome!",
            },
        )

        print("mail sent")
        print(result.json())

    except Exception as e:
        print(f"An error occurred {str(e)}")
