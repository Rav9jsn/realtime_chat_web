import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import asset from "../assets/image";
import { app } from "../firebase";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  getDocs,
  serverTimestamp,
  getFirestore,
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const userUid = useLocation().state;
  const db = getFirestore(app);
  const [userData, setUserData] = useState(null);
  const [anoUserEmail, setAnoUserEmail] = useState(null);
  const [SearchedUser, setSearchedUser] = useState(null);

  const status = navigator.onLine;
  const [newMsg, setNewMsg] = useState(null);
  const offlineOrOnline = navigator.onLine;

  // get user data after Login
  const getUserData = async (uid) => {
    const docSnap = await getDoc(doc(db, "user", uid));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  };
  useEffect(() => {
    const getData = async () => {
      const ye = await getUserData(userUid);
      setUserData(ye);
    };
    getData();
  }, [userUid]);
  // finding email if exist in firestore if get then get its data
  const searchUserByEmail = async (email) => {
    const q = query(collection(db, "user"), where("userEmail", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const matchedUser = querySnapshot.docs[0].data();
      matchedUser.uid = querySnapshot.docs[0].id; // ID bhi le le
      return matchedUser;
    } else {
      return null; // Not found
    }
  };
  const getSearchuserData = async () => {
    if (anoUserEmail !== userData.userEmail) {
      const user = await searchUserByEmail(anoUserEmail);
      if (user) {
        setSearchedUser(user); // Show in UI
        setAnoUserEmail("");
      } else {
        alert("User not found");
      }
    } else {
      alert("Please provide an email address that is not yours.");
    }
  };
  // Create chat room for two person
  const generateChatId = (uid1, uid2) => {
    return [uid1, uid2].sort().join("_");
  };
  const createOrGetChatRoom = async (uid1, uid2) => {
    const chatId = generateChatId(uid1, uid2); // "uidA_uidB"
    const chatRef = doc(db, "chats", chatId);

    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      //  Chat room doesn't exist, so we create one
      await setDoc(chatRef, {
        participants: [uid1, uid2],
        createdAt: serverTimestamp(),
      });
    }

    return chatId; // Return to use it for messages, navigation
  };
  // create chat roop
  const room = async () => {
    const chatId = await createOrGetChatRoom(userUid, SearchedUser.uid);
    navigate(`/chat/${chatId}`);
  };
  // random
  const [msg, setmsg] = useState([
    "hi",
    "good morning",
    "ok",
    "chle  tg serr tergdsf sgvd",
  ]);

  const send = () => {
    setmsg((prev) => [...prev, newMsg]);
    setNewMsg("");
  };
  const user = useSelector((state) => state.user);

  return userData ? (
    <div className="flex h-[100vh]">
      <div className="sm:flex hidden bg-[#005d4b] sm:w-[25%] flex-col">
        <div className="flex flex-col gap-5 items-center">
          <form className="flex my-4  justify-center items-center">
            <input
              type="email"
              value={anoUserEmail}
              onChange={(e) => {
                setAnoUserEmail(e.target.value);
              }}
              className="outline-none font-[1px] w-[90%] px-[4%] bg-green-200 rounded-bl-[5px] rounded-tl-[5px]"
              placeholder="Search By Email"
            />
            <img
              onClick={getSearchuserData}
              className="w-[20px] py-0.5 rounded-tr-[5px] cursor-pointer rounded-br-[5px] mr-0.5 bg-green-200"
              src={asset.seach_icon}
              alt=""
            />
          </form>
          <div className="flex gap-5 pr-2 pl-0.5 py-1 rounded-3xl cursor-pointer text-[#f2f2f2]  bg-[#0000003e] ">
            <img
              className=" rounded-full w-[45px]"
              src={userData.photoUrl}
              alt=""
            />
            <div>
              <p className="capitalize">{userData.userName}</p>
              <p>{userData.userEmail}</p>
            </div>
          </div>
          {SearchedUser && (
            <div
              onClick={room}
              className="flex gap-5 pr-2 pl-0.5 py-1 rounded-3xl cursor-pointer text-[#f2f2f2]  bg-[#0000003e] "
            >
              <img
                className=" rounded-full w-[45px]"
                src={SearchedUser.photoUrl}
                alt=""
              />
              <div>
                <p className="capitalize">{SearchedUser.userName}</p>
                <p>{SearchedUser.userEmail}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="sm:w-[75%] w-[100%] sticky flex flex-col justify-between bg-[#aaaaaa]">
        <div className="flex gap-5  px-2 py-1 cursor-pointer text-[#f2f2f2]  bg-[#000000be] ">
          <img
            className=" rounded-full w-[45px]"
            src={userData.photoUrl}
            alt=""
          />
          <div>
            <p className="capitalize">{userData.userName}</p>
            {status ? <p>Online</p> : <p>Offline</p>}
          </div>
        </div>
        <div className=" flex overflow-y-scroll justify-between">
          {/* right msg */}
          <div></div>
          {/* left msg */}
          <div className="flex pr-5 gap-4 flex-col items-end justify-between">
            {msg.map((msg, i) => {
              return (
                <div
                  className="bg-[#0000003f] w-fit inline-block rounded-b-md rounded-tl-md p-[3px] text-right "
                  key={i}
                >
                  {msg}
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-b-2  flex px-5 justify-between cursor-pointer w-[100%] bg-[#128c7eb9]">
          <img className="w-[15px]" src={asset.smile_icon} alt="" />
          <img className="w-[15px]" src={asset.link_icon} alt="" />
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="w-[80%] focus:bg-[#bdc1c11f] rounded-[8px] outline-none px-10 py-4 "
            type="text"
            placeholder="Type a message"
          />
          <img
            onClick={send}
            className="w-[15px]"
            src={asset.mic_icon}
            alt=""
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default Home;
