import { useNavigate } from "react-router";
import asset from "../assets/image";
import { app } from "../firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const Signin = () => {
  const navigate = useNavigate();

  const SignWithGoogle = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const user = (await signInWithPopup(auth, provider)).user;
      const db = getFirestore(app);
      const def = await setDoc(doc(db, "user", user.uid), {
        userName: user.displayName,
        userEmail: user.email,
        photoUrl: user.photoURL,
        uploadedAt: Date.now(),
      });
      navigate("/Home", { state: user.uid });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <>
      <div className="bg-[#e3efd3] gap-[20px] flex-col flex justify-center items-center h-[100vh]">
        <h1 className="bg-gradient-to-r from-green-500  to-indigo-300 text-[20px] inline-block text-transparent bg-clip-text font-bold">
          Log in
        </h1>

        <div
          onClick={SignWithGoogle}
          className=" p-[10px]   bg-gradient-to-r from-lime-100 to-green-200 cursor-pointer rounded-2xl flex  gap-2.5  "
        >
          <img className="w-[19px]" src={asset.google_icon} alt="" />
          <p className="text-[15px]  text-[#797979] font-semibold ">
            Countinue with Google
          </p>
        </div>
      </div>
    </>
  );
};

export default Signin;
