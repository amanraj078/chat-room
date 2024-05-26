import React, { useEffect, useState } from "react";
import { database, DATABASE_ID, COLLECTION_ID } from "../appwriteConfig";
import { ID, Query, Role, Permission } from "appwrite";
import { Trash2 } from "react-feather";
import client from "../appwriteConfig";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";

const Room = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState("");

    useEffect(() => {
        getMessages();
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
            (response) => {
                if (
                    response.events.includes(
                        "databases.*.collections.*.documents.*.create"
                    )
                ) {
                    setMessages((prev) => [response.payload, ...prev]);
                }
                if (
                    response.events.includes(
                        "databases.*.collections.*.documents.*.delete"
                    )
                ) {
                    setMessages((prev) =>
                        prev.filter(
                            (message) => message.$id !== response.payload.$id
                        )
                    );
                }
            }
        );
        return () => {
            unsubscribe();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const permissions = [Permission.write(Role.user(user.$id))];

        let payload = {
            user_id: user.$id,
            username: user.name,
            body: messageBody,
        };

        let response = await database.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            payload,
            permissions
        );
        console.log("RESPONSE: ", response);

        // setMessages((prev) => [response, ...messages]);
        setMessageBody("");
    };

    const getMessages = async () => {
        const response = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.orderDesc("$createdAt"), Query.limit(20)]
        );
        // console.log(response);
        setMessages(response.documents);
    };

    const deleteMessage = async (message_id) => {
        database.deleteDocument(DATABASE_ID, COLLECTION_ID, message_id);
        // setMessages((prev) =>
        //     prev.filter((message) => message.$id !== message_id)
        // );
    };

    return (
        <main className="container">
            <Header />
            <div className="room--container">
                <form onSubmit={handleSubmit} className="message--form">
                    <div>
                        <textarea
                            required
                            maxLength={1000}
                            placeholder="Say something..."
                            onChange={(e) => setMessageBody(e.target.value)}
                            value={messageBody}
                        ></textarea>
                    </div>
                    <div className="send-btn--wrapper">
                        <input
                            className="btn btn--secondary"
                            type="submit"
                            value="Send"
                        />
                    </div>
                </form>
                <div>
                    {messages.map((message) => (
                        <div key={message.$id} className="message--wrapper">
                            <div className="message--header">
                                <p>
                                    {message?.username ? (
                                        <span> {message?.username}</span>
                                    ) : (
                                        "Anonymous user"
                                    )}

                                    <small className="message-timestamp">
                                        {" "}
                                        {new Date(
                                            message.$createdAt
                                        ).toLocaleString()}
                                    </small>
                                </p>
                                {message.$permissions.includes(
                                    `delete(\"user:${user.$id}\")`
                                ) && (
                                    <Trash2
                                        className="delete--btn"
                                        onClick={() => {
                                            deleteMessage(message.$id);
                                        }}
                                    />
                                )}
                            </div>
                            <div
                                className={
                                    "message--body" +
                                    (message.user_id === user.$id
                                        ? " message--body--owner"
                                        : "")
                                }
                            >
                                <span>{message.body}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Room;
