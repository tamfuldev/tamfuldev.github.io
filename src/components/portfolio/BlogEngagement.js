import React from "react";
import firebase from "firebase/compat/app";
import { FiLogOut, FiMessageCircle, FiSend, FiUserPlus } from "react-icons/fi";
import { auth, firestore } from "../../configs/firebase";
import { formatDate } from "../../utils/blogAdmin";

const reactions = [
    { icon: "👍", id: "like", label: "Like" },
    { icon: "🔥", id: "fire", label: "Fire" },
    { icon: "❤️", id: "love", label: "Love" },
    { icon: "👏", id: "clap", label: "Clap" },
    { icon: "🤔", id: "think", label: "Think" },
];

const copy = {
    en: {
        authHint: "Login or create an account to react and comment.",
        commentPlaceholder: "Write a thoughtful comment...",
        comments: "Comments",
        displayName: "Display name",
        email: "Email",
        login: "Login",
        logout: "Logout",
        noComments: "No comments yet. Be the first one in the room.",
        password: "Password",
        reactions: "Reactions",
        register: "Create account",
        send: "Send comment",
        switchLogin: "Already have an account? Login",
        switchRegister: "New here? Create account",
    },
    vi: {
        authHint: "Đăng nhập hoặc tạo tài khoản để thả cảm xúc và bình luận.",
        commentPlaceholder: "Viết bình luận của bạn...",
        comments: "Bình luận",
        displayName: "Tên hiển thị",
        email: "Email",
        login: "Đăng nhập",
        logout: "Đăng xuất",
        noComments: "Chưa có bình luận nào. Bạn mở hàng nhé.",
        password: "Mật khẩu",
        reactions: "Cảm xúc",
        register: "Tạo tài khoản",
        send: "Gửi bình luận",
        switchLogin: "Đã có tài khoản? Đăng nhập",
        switchRegister: "Lần đầu ghé chơi? Tạo tài khoản",
    },
};

const BlogEngagement = ({ blogId, language = "en" }) => {
    const text = copy[language] || copy.en;
    const [authError, setAuthError] = React.useState("");
    const [comment, setComment] = React.useState("");
    const [comments, setComments] = React.useState([]);
    const [displayName, setDisplayName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [mode, setMode] = React.useState("login");
    const [password, setPassword] = React.useState("");
    const [reactionDocs, setReactionDocs] = React.useState([]);
    const [savingAuth, setSavingAuth] = React.useState(false);
    const [savingComment, setSavingComment] = React.useState(false);
    const [savingReaction, setSavingReaction] = React.useState("");
    const [user, setUser] = React.useState(() => auth.currentUser);

    const commentsRef = React.useMemo(
        () => firestore.collection("blogs").doc(blogId).collection("comments"),
        [blogId]
    );
    const reactionsRef = React.useMemo(
        () => firestore.collection("blogs").doc(blogId).collection("reactions"),
        [blogId]
    );

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    React.useEffect(() => {
        const unsubscribe = commentsRef.orderBy("createdAt", "desc").onSnapshot((snapshot) => {
            setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [commentsRef]);

    React.useEffect(() => {
        const unsubscribe = reactionsRef.onSnapshot((snapshot) => {
            setReactionDocs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [reactionsRef]);

    const reactionCounts = React.useMemo(() => {
        const counts = reactions.reduce((accumulator, reaction) => ({
            ...accumulator,
            [reaction.id]: 0,
        }), {});

        reactionDocs.forEach((reaction) => {
            if (counts[reaction.reaction] !== undefined) {
                counts[reaction.reaction] += 1;
            }
        });

        return counts;
    }, [reactionDocs]);

    const activeReaction = user
        ? reactionDocs.find((reaction) => reaction.uid === user.uid)?.reaction
        : "";

    const handleAuth = async (event) => {
        event.preventDefault();
        setAuthError("");
        setSavingAuth(true);

        try {
            if (mode === "register") {
                const credential = await auth.createUserWithEmailAndPassword(email, password);

                if (displayName.trim()) {
                    await credential.user.updateProfile({
                        displayName: displayName.trim(),
                    });
                }
            } else {
                await auth.signInWithEmailAndPassword(email, password);
            }

            setEmail("");
            setPassword("");
            setDisplayName("");
        } catch (error) {
            setAuthError(error.message);
        } finally {
            setSavingAuth(false);
        }
    };

    const handleReaction = async (reactionId) => {
        if (!user) {
            setAuthError(text.authHint);
            return;
        }

        if (!user.email) {
            setAuthError("Email account is required.");
            return;
        }

        setSavingReaction(reactionId);
        setAuthError("");

        try {
            const reactionRef = reactionsRef.doc(user.uid);

            if (activeReaction === reactionId) {
                await reactionRef.delete();
            } else {
                await reactionRef.set({
                    reaction: reactionId,
                    uid: user.uid,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    userEmail: user.email || "",
                    userName: user.displayName || user.email || "Reader",
                });
            }
        } catch (error) {
            setAuthError(error.message);
        } finally {
            setSavingReaction("");
        }
    };

    const handleSubmitComment = async (event) => {
        event.preventDefault();

        if (!user) {
            setAuthError(text.authHint);
            return;
        }

        if (!comment.trim()) {
            return;
        }

        if (!user.email) {
            setAuthError("Email account is required.");
            return;
        }

        if (comment.trim().length > 1000) {
            setAuthError("Comment is too long.");
            return;
        }

        setSavingComment(true);
        setAuthError("");

        try {
            await commentsRef.add({
                body: comment.trim(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid: user.uid,
                userEmail: user.email || "",
                userName: user.displayName || user.email || "Reader",
            });
            setComment("");
        } catch (error) {
            setAuthError(error.message);
        } finally {
            setSavingComment(false);
        }
    };

    return (
        <section className="portfolio-blog-engagement">
            <div className="portfolio-blog-reactions">
                <div className="portfolio-engagement-head">
                    <FiMessageCircle />
                    <div>
                        <h3>{text.reactions}</h3>
                    </div>
                </div>

                <div className="portfolio-reaction-row">
                    {reactions.map((reaction) => (
                        <button
                            type="button"
                            className={`portfolio-reaction-btn${activeReaction === reaction.id ? " is-active" : ""}`}
                            disabled={savingReaction === reaction.id}
                            key={reaction.id}
                            onClick={() => handleReaction(reaction.id)}
                            title={reaction.label}
                        >
                            <span>{reaction.icon}</span>
                            <strong>{reactionCounts[reaction.id] || 0}</strong>
                        </button>
                    ))}
                </div>
            </div>

            <div className="portfolio-comment-panel">
                <div className="portfolio-comment-panel-head">
                    <div>
                        <h3>{text.comments}</h3>
                    </div>
                    {user && (
                        <button type="button" className="portfolio-comment-logout" onClick={() => auth.signOut()}>
                            <FiLogOut />
                            {text.logout}
                        </button>
                    )}
                </div>

                {!user && (
                    <form className="portfolio-reader-auth" onSubmit={handleAuth}>
                        <p>{text.authHint}</p>

                        {mode === "register" && (
                            <input
                                value={displayName}
                                onChange={(event) => setDisplayName(event.target.value)}
                                placeholder={text.displayName}
                                maxLength={120}
                            />
                        )}

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder={text.email}
                            maxLength={254}
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder={text.password}
                            required
                        />

                        <div className="portfolio-reader-auth-actions">
                            <button type="submit" disabled={savingAuth}>
                                <FiUserPlus />
                                {savingAuth ? "..." : mode === "register" ? text.register : text.login}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setAuthError("");
                                    setMode((currentMode) => currentMode === "login" ? "register" : "login");
                                }}
                            >
                                {mode === "login" ? text.switchRegister : text.switchLogin}
                            </button>
                        </div>
                    </form>
                )}

                {authError && <div className="portfolio-comment-error">{authError}</div>}

                {user && (
                    <form className="portfolio-comment-form" onSubmit={handleSubmitComment}>
                        <textarea
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                            placeholder={text.commentPlaceholder}
                            maxLength={1000}
                            rows="4"
                        />
                        <button type="submit" disabled={savingComment || !comment.trim()}>
                            <FiSend />
                            {savingComment ? "..." : text.send}
                        </button>
                    </form>
                )}

                <div className="portfolio-comment-list">
                    {!comments.length && (
                        <div className="portfolio-comment-empty">{text.noComments}</div>
                    )}

                    {comments.map((item) => (
                        <article className="portfolio-comment-item" key={item.id}>
                            <div>
                                <strong>{item.userName || "Reader"}</strong>
                                <span>{formatDate(item.createdAt)}</span>
                            </div>
                            <p>{item.body}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogEngagement;
