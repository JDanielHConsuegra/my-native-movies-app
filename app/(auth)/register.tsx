import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { registerUser } from "@/services/firebase";
import { Link, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Button,
  Image,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Yup from "yup";

// 📌 Esquema de validación con Yup
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "The name must be at least 2 characters long")
    .required("Name is required"),
  email: Yup.string()
    .email("The email must be a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "The password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
      "The password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "The passwords must match")
    .required("Password confirmation is required"),
});

export default function RegisterForm() {
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  return (
    <Formik
      initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
      validationSchema={RegisterSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setRegisterError(null);
        try {
          await registerUser(values.name, values.email, values.password);
          console.log("User registered successfully");
          setShowAlert(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
          setTimeout(() => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              setShowAlert(false);
              router.replace("/login");
            });
          }, 400);
        } catch (error: any) {
          setRegisterError(error.message || "Error registering user");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <View className="flex-1 px-8 bg-primary">
          {showAlert && (
            <Animated.View
              className="absolute border border-light-200 top-10 left-0 right-0 bg-gray-800 p-4 z-10"
              style={{ opacity: fadeAnim }}
            >
              <Text className="text-white text-center">
                Registration successful!
              </Text>
            </Animated.View>
          )}
          <Image
            source={images.bg}
            className="absolute w-full z-0"
            tintColor={"1C1C1C"}
          />
          <Image
            source={icons.logo}
            className="h-[250px] w-[380px] rounded mt-[64px] mx-auto"
          />
          {/* Campo Nombre */}
          <Text className="text-2xl text-light-200 self-center my-5 font-bold uppercase">
            Register form
          </Text>
          <TextInput
            className="border text-light-200 border-gray-300 rounded-md p-3 mb-2"
            placeholder="Name"
            autoCapitalize="words"
            placeholderTextColor={"#d1d5db"}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            value={values.name}
          />
          {errors.name && touched.name && (
            <Text className="text-red-500 mb-2">{errors.name}</Text>
          )}

          {/* Campo Email */}
          <TextInput
            className="border text-light-200 border-gray-300 rounded-md p-3 mb-2"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={"#d1d5db"}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
          />
          {errors.email && touched.email && (
            <Text className="text-red-500 mb-2">{errors.email}</Text>
          )}

          {/* Campo Contraseña y verificacion */}
          <View className="flex flex-row justify-between gap-1">
            <View className="w-[48%]">
              <TextInput
                className="border text-gray-200 border-gray-300 rounded-md p-3 mb-2"
                placeholder="Password"
                placeholderTextColor={"#d1d5db"}
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              {errors.password && touched.password && (
                <Text className="text-red-500 mb-2">{errors.password}</Text>
              )}
            </View>
            {/* Campo Verificacion Contraseña */}
            <View className="w-[48%]">
              <TextInput
                className="border text-gray-200 border-gray-300 rounded-md p-3 mb-2"
                placeholder="Confirm password"
                placeholderTextColor={"#d1d5db"}
                secureTextEntry
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Text className="text-red-500 text-center mb-2">
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
          </View>

          {registerError && (
            <Text className="text-red-500 mb-2">{registerError}</Text>
          )}

          {/* Botón de Login */}
          <View className="mt-4 bg-gradient-to-t from-slate-800 to-slate-500 text-light-100">
            {isSubmitting ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Button
                color={"#1e3a8a"}
                onPress={() => handleSubmit()}
                title="Register"
              />
            )}
          </View>
          <Text className="text-light-100 mt-5 self-center">
            You allready have an account?{" "}
            <Link className="font-bold underline" href="/login">
              Login
            </Link>
          </Text>
        </View>
      )}
    </Formik>
  );
}
