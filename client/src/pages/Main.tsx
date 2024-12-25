import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaBars, FaRegEdit, FaCopy, FaArrowUp, FaVolumeUp, FaShareAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import loadingGif from "/loading.gif";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";


const Main = () => {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [quickPrompt, setQuickPrompt] = useState<boolean>(false);
  const [conversation, setConversation] = useState<any[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const [session, setSession] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currentConversation, setCurrentConversation] = useState<{conversationId: number, messages: any} | null>(null);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setSession(Array.isArray(parsedUser) ? parsedUser : [parsedUser]);
      } catch (error) {
        setSession([]);
      }
    } else {
      setSession([]);
    }
  }, []);

   useEffect(() => {
   const getConv = async () => {
    if (!session) {
      console.error("Session or email is undefined");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_GETCONV_URL}?email=${session[0].email}`
      );
      const data = await res.json();
      console.log('getchats '+data)
      setConversation(data);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  getConv();
}, [session]);

  useEffect(() => {
  const saveConversation = async () => {
    
    try {
      const res = await fetch(import.meta.env.VITE_SAVECONV_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session[0].email,
          conversation: {
          messages: conversation, // Wrap messages in an object
        },
        }),
      });
      const data = await res.json();
      console.log('save cbats' +data)
      console.log("Conversation saved:", data);
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  saveConversation(); 
}, [currentConversation]);


  const startNewConversation = () => {
  setCurrentConversation({
    conversationId: Date.now(),
    messages: [],
  });
  setConversation([]);
};

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      return;
    }
    setConversation((prev) => [...prev, { sender: "user", message: input }]);
    setLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
        }),
      });

      const data = await res.json();
      setConversation((prev) => [...prev, { sender: "ai", message: data?.response }]);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      setConversation((prev) => [...prev, { sender: "ai", message: "Error generating content." }]);
    } finally {
      setLoading(false);
    }

    setInput("");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);
   
   
   const toggleNav = () => {
    setShowSettings((prev) => !prev);
  };

  const closeNav = () => {
    setShowSettings(false);
  };
  
  return (
    <section className="min-h-screen font-sans bg-zinc-800">
      <Navbar isOpen={showSettings} closeNav={closeNav} session={session} conversations={conversation || []} />
      <header className="text-lg select-none font-sans bg-zinc-800 fixed top-0 w-full text-white p-5 flex justify-between items-center md:pl-52">
        {session.length > 0 ? (
          <>
            <FaBars className="md:hidden z-[1000] block text-white" onClick={toggleNav} />
            <div className="flex items-center bg-zinc-500 rounded py-1 px-3">
               <h1 className="text-center text-white font-extrabold">ChatGPT</h1>
               <IoIosArrowDown className="ml-2" />
            </div>
            <FaRegEdit className="text-white" onClick={startNewConversation}/>
          </>
        ) : (
 
          <>
            <FaRegEdit className="text-white"/>
            <div className="flex items-center">
              <h1 className="text-center text-white font-extrabold">ChatGPT</h1>
              <IoIosArrowDown className="ml-2" />
            </div>
            <Link to="login" className="rounded-2xl px-2 text-black bg-white">
              Login
            </Link>
          </>
        )}
      </header>

      <div id="container" className={`text-sm select-none bg-zinc-800 pt-16 md:ml-40 overflow-x-hidden pb-16 font-san px-5 max-w-full mb-15 ${showSettings ? "md:ml-52" : "md:ml-0"}`}>
        <div ref={chatContainerRef} className="mb-48">
          <section className={`${conversation.length === 0 ? "" : "hidden"} md:overflow-x-hidden md:max-w-full md:transform mx-auto md:ml-44 translate-y-28 text-white grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-5 items-center`}>
            <img src="https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg" className="block w-20 mx-auto md:col-span-full mb-4" />
            {[
              { content: "Teach me Typescript and React"},
              { content: "Summarize a Long Document or Poem"},
              { content: "List some tips on how to succeed in life" },
              { content: "How do I land my First Tech Job"},
            ].map((prompt, index) => (
              <div key={index}>
                <div
                  onClick={() => {
                    setInput(prompt.content);
                    handleGenerate({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
                  }}
                  className={`flex items-center h-16 p-3 border-2 border-zinc-700 shadow-4xl text-white md:mb-0 mb-3 rounded-2xl`}
                >
                  {prompt.content}
                </div>
              </div>
            ))}
          </section>
          {conversation.map((chat, index) => {
            const isUserMessage = chat.sender === "user";
            const isAIMessage = chat.sender === "ai";

            return (
              <div key={index} className={isUserMessage ? "bg-zinc-700 text-white rounded-2xl w-fit max-w-[70%] px-4 py-3 text-white mt-7 ml-auto" : "bg-transparent text-white w-full p-2 mt-5"}>
                {isAIMessage ? (
                  <>
                    <img src="https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg" className="float-left w-8 mr-3" />
                    <div>
                      <ReactMarkdown className="prose prose-sm leading-loose overflow-x-auto">{chat.message}</ReactMarkdown>
                      <div className="ml-10">
                        <FaCopy className="text-white inline text-sm mt-4" onClick={() => navigator.clipboard.writeText(chat.message)} />
                        <FaVolumeUp
                          className="inline mt-4 text-sm text-white ml-5"
                          onClick={() => {
                            const speech = new SpeechSynthesisUtterance(chat.message);
                            speech.volume = 1;
                            speech.rate = 1;
                            speechSynthesis.speak(speech);
                          }}
                        />
                        <FaShareAlt
                          className="inline text-white mt-4 ml-5 text-sm"
                          onClick={() => {
                            const shareData = {
                              title: "Chat GPT Clone By Samuel Tuoyo",
                              text: chat.message,
                              url: "/",
                            };
                            navigator.share(shareData);
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <p>{chat.message}</p>
                )}
              </div>
            );
          })}
          {loading && <Loader />}
        </div>
      </div>

      <footer className="text-sm select-none bg-zinc-800 p-5 fixed bottom-0 w-full md:w-10/12 md:left-48 md:right-80">
        <form onSubmit={handleGenerate} className="relative">
          <div className="relative">
            <textarea
              value={input}
              placeholder="Message ChatGPT"
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-14 p-4 bg-zinc-600 rounded-2xl flex items-center justify-center placeholder:text-left text-white"
            />
          </div>

          <button ref={sendButtonRef} type="submit" className="absolute top-2 right-2 bg-zinc-700 h-10 w-10 text-xl rounded-full text-white z-10">
            <FaArrowUp className="inline" />
          </button
>
        </form>
        <div className="mt-2 text-gray-400 text-sm line-clamp-1 md:line-clamp-none text-white text-center">ChatGPT can make mistakes. Check for important info</div>
      </footer>
    </section>
  );
};

export default Main;