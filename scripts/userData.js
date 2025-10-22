import { daysAgo } from "./utils/dates.js";

export let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

let allUsers = JSON.parse(localStorage.getItem('personalDetails')) || [];

if(!currentUser){
  // create demo user if none
  currentUser = {
    firstName: "Don",
    lastName: "Jon",
    email: "donjon@mulima.local",
    points: 0,
    savingsUGX: 0,
    vaults: [],
    history: [
      {type:'credit', note:'Account credited', amount:1200, date: daysAgo(6)},
      {type:'credit', note:'Saved UGX 5,000', amount:100, date: daysAgo(4)},
      {type:'redeem', note:'Redeemed groceries', amount:0, date: daysAgo(2)}
    ],
    memberSince: (new Date()).toLocaleDateString()
  };
  
  saveToStorage()

  // push to personalDetails if absent
  if(!allUsers.some(u=>u.email===currentUser.email)) {
    allUsers.push(currentUser);
    localStorage.setItem('personalDetails', JSON.stringify(allUsers));
  }
}

export function saveToStorage() {
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}