import json
from flask import Flask, request, jsonify
from rasa.core.agent import Agent
from rasa.core.utils import EndpointConfig
from rasa.nlu.model import Interpreter
from rasa.core import Processor
from rasa.core.events import Event, SlotSet
from rasa.core.policies import KerasPolicy, MemoizationPolicy
import logging

# Initialize Flask app
app = Flask(__name__)

# Set up logging for debugging purposes
logging.basicConfig(level=logging.DEBUG)

# Define mock inventory (this would be replaced with database calls in a real-world app)
inventory_data = {
    "Yeezy 350": {"size_10": 5},
    "Jordan 1 Red": {"Berlin": 3},
    "Nike Air Max": {"size_9": 7},
    "Nike Air Max 90": {"Store A": 12}
}

# Define the Rasa model (Mocked as Rasa is normally a separate training process)
class ActionCheckInventory:
    def name(self):
        return "action_check_inventory"

    def run(self, dispatcher, tracker, domain):
        sneaker = tracker.latest_message.get('text')
        response = ""

        # Match based on sneaker model
        if "Yeezy 350" in sneaker:
            size = "size_10"
            stock = inventory_data["Yeezy 350"].get(size, 0)
            response = f"We have {stock} Yeezy 350 in size 10."
        elif "Jordan 1 Red" in sneaker:
            store = "Berlin"
            stock = inventory_data["Jordan 1 Red"].get(store, 0)
            response = f"We have {stock} Jordan 1 Red in the {store} store."
        elif "Nike Air Max" in sneaker:
            size = "size_9"
            stock = inventory_data["Nike Air Max"].get(size, 0)
            response = f"We have {stock} Nike Air Max in size 9."
        elif "Nike Air Max 90" in sneaker:
            store = "Store A"
            stock = inventory_data["Nike Air Max 90"].get(store, 0)
            response = f"We have {stock} Nike Air Max 90 in {store}."
        else:
            response = "Sorry, I couldn't find that sneaker in our stock."

        dispatcher.utter_message(text=response)
        return []

# Define the Action to trigger the chatbot behavior
class CustomProcessor(Processor):
    def handle_message(self, message, sender, **kwargs):
        action = ActionCheckInventory()
        return action.run(dispatcher=self._dispatcher, tracker=self._tracker, domain=self._domain)

# Initialize Rasa API configurations (mocked as Rasa server is not running)
# Replace with proper endpoint when deploying Rasa separately
endpoint_config = EndpointConfig("http://localhost:5005/webhooks/rest/webhook")

# Initialize Rasa Interpreter and Agent
interpreter = Interpreter.load("path/to/rasa_model")  # Load pre-trained model (change path)
agent = Agent.load("path/to/rasa_model", interpreter=interpreter)

# Define the chat endpoint
@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get("message")
    payload = {
        "sender": "user",
        "message": user_message
    }

    # Process the message through the Rasa agent (chatbot)
    try:
        response = agent.handle_text(user_message)
        if response:
            bot_message = response[0]['text']
            return jsonify({"response": bot_message})
        else:
            return jsonify({"response": "Sorry, I couldn't understand your query."})
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"response": "An error occurred, please try again later."})

# Starting point for Flask server
if __name__ == "__main__":
    app.run(debug=True, port=5000)
