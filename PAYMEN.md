1. pip install stripe

2. settings.py:
    STRIPE*SECRET_KEY = "sk_test*..." # Replace with your real secret key
    STRIPE*PUBLISHABLE_KEY = "pk_test*..."

3. views.pay

# views.py
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import stripe
import json

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def create_payment_intent(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            amount = int(float(data.get("amount", 0)) * 100)  # convert to paise/cents

            # Optional: you could attach metadata with user info here
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency="usd",  # or "inr" if you're in India
                automatic_payment_methods={"enabled": True},
            )
            return JsonResponse({"clientSecret": intent.client_secret})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

    

4. urls.py

# urls.py
from django.urls import path
from .views import create_payment_intent

urlpatterns = [
    path("api/stripe/create-intent/", create_payment_intent, name="create-payment-intent"),
]


5. Setting.py

import os
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")


TRY THIS IF NOT PREVIOUS WORKING

# views.py

import stripe
import json
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Order

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET  # set this in your .env or settings

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)

    # ✅ Handle successful payment
    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]

        # Optional: you could pass metadata in PaymentIntent to know which order it is
        Order.objects.create(
            first_name="John",
            last_name="Doe",
            address="123 Main St",
            city="New York",
            state="NY",
            zip_code="10001",
            amount=intent["amount"] / 100,
            payment_intent_id=intent["id"],
            status="paid",
        )

    return HttpResponse(status=200)
