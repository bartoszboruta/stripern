import { Button, StyleSheet, LogBox, View } from "react-native";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { IntentConfiguration } from "@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet";

LogBox.ignoreAllLogs();

const API_URL = "http://localhost:3000";
const PUBLISHABLE_KEY = "YOUR PUBLISHABLE KEY HERE";

export default function App() {
  return (
    <StripeProvider
      publishableKey={PUBLISHABLE_KEY}
      merchantIdentifier="YOUR_MERCHANT_HERE" // does not matter for testing
    >
      <CheckoutScreen />
    </StripeProvider>
  );
}

const CheckoutScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const confirmHandler: IntentConfiguration["confirmHandler"] = async (
    paymentMethod,
    shouldSavePaymentMethod,
    intentCreationCallback
  ) => {
    // Make a request to your own server.
    const response = await fetch(`${API_URL}/create-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: paymentMethod.id,
      }),
    });
    // Call the `intentCreationCallback` with your server response's client secret or error
    const { client_secret, error } = await response.json();

    console.log({ error });

    if (client_secret) {
      intentCreationCallback({ clientSecret: client_secret });
    } else {
      intentCreationCallback({
        error: {
          code: "Failed",
          message: error?.message,
          localizedMessage: error?.message,
        },
      });
    }
  };

  const handlePayPress = async () => {
    const initializePaymentSheet = async () => {
      const { error } = await initPaymentSheet({
        applePay: {
          merchantCountryCode: "US",
        },
        merchantDisplayName: "Example, Inc.",
        intentConfiguration: {
          mode: {
            amount: 1099,
            currencyCode: "USD",
          },
          confirmHandler: confirmHandler,
        },
      });
      if (error) {
        // handle error
      }
    };
    await initializePaymentSheet();

    presentPaymentSheet();
  };

  return (
    <View style={styles.container}>
      <Button
        title="Pay"
        onPress={() => {
          handlePayPress();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
