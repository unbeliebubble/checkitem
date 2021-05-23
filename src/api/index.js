import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import jsonInfo from "../json/jsonInfo.json";
import products from "../json/products.json";

// INITIALIZE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAtGABQOdWalmxrgwbtOi0XpUXGbbC3XXA",
  authDomain: "wkdhw-d6760.firebaseapp.com",
  projectId: "wkdhw-d6760",
  storageBucket: "wkdhw-d6760.appspot.com",
  messagingSenderId: "994295453380",
  appId: "1:994295453380:web:5f51ae886442ae1bdd1b91",
  measurementId: "G-25LNXVCXEP"
};

firebase.initializeApp(firebaseConfig);
// REFERENCE PRODUCTS
const productsCollectionRef = firebase.firestore().collection("product");
const productsDocRef = productsCollectionRef.doc("json");
const allProductsCollectionRef = productsDocRef.collection("allProduct");
const allOrdersCollectionRef = firebase.firestore().collection("allOrders");

//REFERENCE AUTH
const auth = firebase.auth();

export const getProductById = async (productId) => {
  // REFERENCE PRODUCTS COLLECTION
  const doc = await allProductsCollectionRef.doc(productId).get();
  return doc.data()
}

export const getProducts = async (url) => {
  const collection = jsonInfo.find(element => element.url === url);
  const collectionName = collection.name || "allProduct";
  let jsonProducts = [];

  // QUERY PRODUCTS
  let querySnapshot;
  if (collectionName === "allProduct")
    querySnapshot = await allProductsCollectionRef.get();
  else
    querySnapshot = await allProductsCollectionRef.where("category", "==", collectionName).get();
  querySnapshot.forEach((doc) => {
    jsonProducts.push(doc.data());
  });
  return jsonProducts;
}

export const feedProducts = () => {
  products.forEach((product) => {
    const docRef = allProductsCollectionRef.doc();
    const id = docRef.id;
    const user = auth.currentUser._id;

    // Store Data for Aggregation Queries
    docRef.set({
      ...product,
      user,
      id
    });
  })
}

export const signInWithEmailPassword = async (email, password) => {
  return await auth.signInWithEmailAndPassword(email, password);
}

export const registerWithEmailPassword = async (email, password, displayName) => {
  await auth.createUserWithEmailAndPassword(email, password);
  const user = auth.currentUser;
  await user.updateProfile({ displayName })
  return user;
}

export const updateUserInfoApi = async (email, password, displayName) => {
  const user = auth.currentUser;
  if (displayName)
    await user.updateProfile({ displayName });
  if (email)
    await user.updateEmail(String(email));
  if (password)
    await user.updatePassword(password);
  return user;
}

export const createOrderApi = async (order) => {
  const user = auth.currentUser.uid;
  const orderRef = await allOrdersCollectionRef.doc();
  const id = orderRef.id;
  // Store Data for Aggregation Queries
  await orderRef.set({
    ...order,
    id,
    user
  });
  return { ...order, id };
}

export const getOrderById = async (orderId) => {
  const doc = await allOrdersCollectionRef.doc(orderId).get();
  return doc.data()
}

export const getOrderByUser = async () => {
  const user = auth.currentUser.uid;
  let jsonOrders = [];

  // QUERY Orders
  const querySnapshot = await allOrdersCollectionRef.where("user", "==", user).get();
  querySnapshot.forEach((doc) => {
    jsonOrders.push(doc.data());
  });
  return jsonOrders;
}

export const signOut = () => {
  auth.signOut();
}

export const checkLoginApi = () => {
  const user = auth.currentUser;
  return user.uid ? true : false;
}

