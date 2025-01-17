import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaBars, FaRegEdit, FaCopy, FaArrowUp, FaVolumeUp, FaShareAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

interface ConversationMessage {
  sender: "user" | "ai";
  message: string;
  timestamp: string;
}

interface Conversation {
  _id: string;
  groupName: string;
  messages: ConversationMessage[];
}

interface Session {
  id?: string;
  email?: string;
}

const Main = () => {
  const [input, setInput] = useState<string>("");
  const [checkSystemTheme, setCheckSystemTheme] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const [session, setSession] = useState<Session>({});
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [fetchedConversations, setFetchedConversations] = useState<Conversation[]>([])
  const { id } = useParams();
  
  useEffect(() => {
  const currentSystemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  setCheckSystemTheme(currentSystemTheme.matches ? "dark" : "light");

  const handleThemeChange = (event: MediaQueryListEvent) => {
    setCheckSystemTheme(event.matches ? "dark" : "light");
  };

  if (currentSystemTheme.addEventListener) {
    currentSystemTheme.addEventListener("change", handleThemeChange);
  } else {
    currentSystemTheme.addListener(handleThemeChange); 
  }

  return () => {
    if (currentSystemTheme.removeEventListener) {
      currentSystemTheme.removeEventListener("change", handleThemeChange);
    } else {
      currentSystemTheme.removeListener(handleThemeChange);
    }
  };
}, []);

  
  useEffect(() => {
    const ConById = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE__BY_ID}${id}`);
        const data = await response.json();
        if (!response.ok) return console.error(data.message);
        setConversation(data.messages)
      } catch (error) {
        console.error(error);
      }
    };
    if (id) {
      ConById();
    }
  }, [id]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setSession({ ...parsedUser });
      } catch {
        setSession({});
      }
    } else {
      setSession({});
    }
  }, []);
  useEffect(() => {
    
  const saveConversation = async () => {
    if (!session.email) return;

    try {
      const formattedMessages = conversation.map((msg) => ({
        sender: msg.sender,
        content: msg.message,
        timestamp: msg.timestamp,
      }));

      const res = await fetch(import.meta.env.VITE_SAVECONV_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.email,
          conversation: {
            groupName: "Default Group Name",
            messages: formattedMessages,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to save conversation");

      const data = await res.json();
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  if (conversation.length > 0) saveConversation();
}, [conversation, session?.email]);



  useEffect(() => {
    const getConv = async () => {
      if (!session || !session?.email) {
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_GETCONV_URL}?email=${session?.email}`
        );
        const data = await res.json();
        setFetchedConversations(data);
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      } catch (error) {
        console.error("Error ing conversations:", error);
      }
    };
    getConv();
  }, [session]);

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!input.trim()) return;
   const imageKeywords = {
      verbs: ["draw", "illustrate", "imagine", "sketch", "visualize", "create", "design", "generate", "paint"],
      nouns: ["image", "images", "pictures", "picture", "art", "drawing", "sketch", "imagine", "illustration"],
    };

    const lowerInput = input.toLowerCase();
    const regex = /(draw|illustrate|sketch|visualize|create|design|generate|paint)\s.*\b(image|picture|art|drawing|sketch|illustration)\b/;
    const isImagePrompt = regex.test(lowerInput) || (imageKeywords.verbs.some((verb) => lowerInput.includes(verb)) && imageKeywords.nouns.some((noun) => lowerInput.includes(noun)));

  setConversation((prev) => [
    ...prev,
    { sender: "user", message: input, timestamp: new Date().toISOString() },
  ]);
  setLoading(true);

  try {
    const res = await fetch(import.meta.env.VITE_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input.trim(), type: isImagePrompt ? "image" : "text" }),
    });

    if (!res.ok) throw new Error("Failed to fetch content");

    const data = await res.json();
    const fullMessage = data.response;

    setConversation((prev) => [
      ...prev,
      { sender: "ai", message: fullMessage, timestamp: new Date().toISOString() },
    ]);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  } catch (error) {
    console.error(error);
    setConversation((prev) => [
      ...prev,
      { sender: "ai", message: "Error generating content.", timestamp: new Date().toISOString() },
    ]);
  } finally {
    setLoading(false);
  }

  setInput("");
};


const handleQuickGenerate = (content: string) => {
  setInput(content);
  handleGenerate({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
};


  const startNewConversation = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_CREATE_CONV_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.id, groupName: "New Conversation", messages: [] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create conversation.");
      }

      const newConversation = await response.json();
      setConversation([]);
      setConversations((prev) => [...prev, newConversation]);
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const toggleNav = () => setShowSettings((prev) => !prev);
  const closeNav = () => setShowSettings(false);
  
  return (
    <section className={`min-h-screen ${checkSystemTheme === "dark" ? "bg-zinc-800" : "bg-white text-black text-4xl"}`}>
      <Navbar isOpen={showSettings} closeNav={closeNav} session={session} conversations={fetchedConversations || []}/>
      <header className="text-lg select-none font-sans bg-zinc-800 fixed top-0 w-full text-white p-5 flex justify-between items-center md:pl-52">
        {session?.email ? (
          <>
            <FaBars className="md:hidden z-[1000] block text-white" onClick={toggleNav} />
            <div className="flex items-center bg-zinc-500 rounded py-1 px-3">
               <h1 className="text-center text-white font-extrabold">ChatGPT</h1>
               <IoIosArrowDown className="ml-2" />
            </div>
            <FaRegEdit className="text-white" />
          </>
        ) : (
          <>
            <FaRegEdit className="text-white" />
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

      <div id="container" className={`text-sm select-none bg-zinc-800 pt-16 md:ml-40 overflow-x-hidden pb-16 px-5 max-w-full mb-15 ${showSettings ? "md:ml-52" : "md:ml-0"}`}>
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
                  onClick={() => handleQuickGenerate(prompt.content)}
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
                    <div>{chat.message.startsWith("data:image/") ? (
                     <img src={chat.message} alt="Generated Content" className="rounded-lg mt-2 md:w-64" />
                      ) : (
                     <ReactMarkdown className="prose prose-sm leading-loose overflow-x-auto">
                         {chat.message}
                     </ReactMarkdown>
                    )}
                      
                      <div className="ml-10">
                        {!chat.message.startsWith("data:image/") ? (
                        <>
                        <FaCopy className="text-white inline text-sm mt-4" onClick={() => navigator.clipboard.writeText(chat.message)} />
                        <FaVolumeUp
                          className="inline mt-4 text-sm text-white ml-3"
                          onClick={() => {
                            const speech = new SpeechSynthesisUtterance(chat.message);
                            speech.volume = 1;
                            speech.rate = 1;
                            speechSynthesis.speak(speech);
                          }}
                        />
                        <FaShareAlt
                          className="inline text-white mt-4 ml-3 text-sm"
                          onClick={() => {
                            const shareData = {
                              title: "Chat GPT Clone By Samuel Tuoyo",
                              text: chat.message,
                              url: "/",
                            };
                            navigator.share(shareData);
                          }}
                        /> </>):(
                         <span></span>
                        )}
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

          <button
          disabled={input.length > 0 ? false : true}
          ref={sendButtonRef} 
          type="submit"
          className={`${input.length > 0 ? "bg-white" : "bg-zinc-500"} absolute top-2 right-2 h-10 w-10 text-xl rounded-full text-zinc-700 z-10`}
          >
            <FaArrowUp className="inline" />
          </button>
        </form>
        <div className="mt-2 text-gray-400 text-sm line-clamp-1 md:line-clamp-none text-white text-center">ChatGPT can make mistakes. Check for important info</div>
      </footer>
    </section>
  );
};

export default Main;