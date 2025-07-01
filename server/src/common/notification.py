import mailtrap as mt
from src.config import Config


class NotificationService:
    @staticmethod
    def send_email(recipient: str, subject: str, message: str):
        try:
            # create mail object
            mail = mt.Mail(
                sender=mt.Address(
                    email=Config.MAIL_SENDER_EMAIL, name=Config.MAIL_SENDER_NAME
                ),
                to=mt.Address(email=recipient),
                subject=subject,
                html=message,
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
        print(f"send sms to {telephone}. Message: {message}")
        # try:
        #     print("sending sms")
        #     response = requests.post(
        #         url="https://api.smslive247.com/api/v4/sms",
        #         json={
        #             "senderID": "CORPMAN",
        #             "messageText": message,
        #             "route": "dnd",
        #             "mobileNumber": telephone,
        #         },
        #         headers={
        #             "accept": "application/json",
        #             "content-type": "application/*+json",
        #             "Authorization": Config.SMS_LIVE_247_KEY,
        #         },
        #     )
        #     print(f"sms sent: {response.text}")
        # except Exception as e:
        #     print(f"Error: {str(e)}")
