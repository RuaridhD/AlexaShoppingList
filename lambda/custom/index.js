/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require("ask-sdk");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  async handle(handlerInput) {
    dblist = await handlerInput.attributesManager.getPersistentAttributes();
    if (dblist.list1 === undefined) {
      dblist.list1 = [];
    }
    handlerInput.attributesManager.setSessionAttributes(dblist);

    const speechText = "What would you like to add to your shopping list?";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const AddIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AddIntent"
    );
  },
  async handle(handlerInput) {
    let sessionAttr = handlerInput.attributesManager.getSessionAttributes();
    let item = handlerInput.requestEnvelope.request.intent.slots.item.value;
    let quantity =
      handlerInput.requestEnvelope.request.intent.slots.quantity.value;

    if (quantity === undefined) {
      quantity = 1;
    }
    if (item === undefined) {
      return handlerInput.responseBuilder
        .speak(
          "I didn't understand that. Please declare an item you would like to add"
        )
        .reprompt("Is there anything else you'd like to add?")
        .getResponse();
    }
    const speechText = `I've added ${quantity} ${item} to the list`;

    let shopping = {};
    shopping.item = item;
    shopping.value = quantity;

    sessionAttr.list1.push(shopping);

    handlerInput.attributesManager.setSessionAttributes(sessionAttr);

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt("Is there anything else you'd like to add?")
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speechText = "You can say hello to me!";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard("Hello World", speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    );
  },
  async handle(handlerInput) {
    let sessionAttr = handlerInput.attributesManager.getSessionAttributes();
    handlerInput.attributesManager.setPersistentAttributes(sessionAttr);
    await handlerInput.attributesManager.savePersistentAttributes();

    const speechText = "Goodbye!";

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard("Hello World", speechText)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    AddIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName("shoppingList")
  .withAutoCreateTable(true)
  .lambda();
