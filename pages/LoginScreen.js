import React, { useState, useContext } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";


const BASE_URL = "http://10.1.15.171:8080/api/user";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);

  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          nim: nim,
          password: password,
        },
        {
          headers: {
            authcode: "astratech@123",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("RESPONSE:", res.data);

      if (res.data.status === 200) {
        login(res.data.data);
      } else {
        Alert.alert("Login Gagal", res.data.message);
      }
    } catch (err) {
      console.log("ERROR:", err);
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="NIM"
        value={nim}
        onChangeText={setNim}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}