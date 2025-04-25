import firebase_admin
from firebase_admin import credentials, auth
import pathlib

from src.firebase.schema import IDVerificationResponse

cred = credentials.Certificate(pathlib.Path(__file__).parent / "service_account.json")

firebase_app = firebase_admin.initialize_app(cred)


def verify_id_token(
    id_token: str, return_detail: bool = False
) -> IDVerificationResponse:
    try:
        decoded_token = auth.verify_id_token(id_token=id_token, app=firebase_app)

        uid = decoded_token["uid"]

        if not return_detail:
            return IDVerificationResponse(is_valid=True)

        user_data = auth.get_user(uid)

        result = user_data.__dict__.get("_data")

        return IDVerificationResponse(
            is_valid=True,
            uid=uid,
            email=result["email"],
            name=result["displayName"],
            image=result["photoUrl"],
        )
    except auth.InvalidIdTokenError:
        return IDVerificationResponse(is_valid=False, error="Invalid ID token")
    except auth.ExpiredIdTokenError:
        return IDVerificationResponse(is_valid=False, error="Expired ID token")
    except Exception as e:
        return IDVerificationResponse(is_valid=False, error=str(e))


# // Import the functions you need from the SDKs you need
# import { initializeApp } from "firebase/app";
# import { getAnalytics } from "firebase/analytics";
# // TODO: Add SDKs for Firebase products that you want to use
# // https://firebase.google.com/docs/web/setup#available-libraries

# // Your web app's Firebase configuration
# // For Firebase JS SDK v7.20.0 and later, measurementId is optional
# const firebaseConfig = {
#   apiKey: "AIzaSyDk0Arq9UyapE6dlqiB_9HIbMNy_FX9LLI",
#   authDomain: "corp-man.firebaseapp.com",
#   projectId: "corp-man",
#   storageBucket: "corp-man.firebasestorage.app",
#   messagingSenderId: "881118742421",
#   appId: "1:881118742421:web:e07ccb1dc36901f369589c",
#   measurementId: "G-1DYFP5S6V5"
# };

# // Initialize Firebase
# const app = initializeApp(firebaseConfig);
# const analytics = getAnalytics(app);