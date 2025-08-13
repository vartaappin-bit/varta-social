// --- Minimal Varta client (Firebase via CDN, no build tools) ---
// Replace CONFIG below with your Firebase project's config (you shared it already).
const firebaseConfig = {
  apiKey: "AIzaSyDiG8WXVkd0pl7hYpV_oN3Y4N35kvkVQ",
  authDomain: "varta-251e7.firebaseapp.com",
  projectId: "varta-251e7",
  storageBucket: "varta-251e7.appspot.com",
  messagingSenderId: "9622396658",
  appId: "1:9622396658:web:5645a906fa12a0cdc76ab",
  measurementId: "G-G15SXCJG92"
};

// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const avatar = document.getElementById('avatar');
const composer = document.getElementById('composer');
const postText = document.getElementById('postText');
const postBtn = document.getElementById('postBtn');
const feed = document.getElementById('feed');
const charCount = document.getElementById('charCount');

// Auth UI events
loginBtn.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (e) {
    alert('Login failed: ' + e.message);
  }
});

logoutBtn.addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  const loggedIn = !!user;
  loginBtn.style.display = loggedIn ? 'none' : 'inline-flex';
  logoutBtn.style.display = loggedIn ? 'inline-flex' : 'none';
  composer.style.display = loggedIn ? 'block' : 'none';
  avatar.style.display = loggedIn && user.photoURL ? 'inline-block' : 'none';
  if (user?.photoURL) avatar.src = user.photoURL;
});

// Character counter
postText.addEventListener('input', () => {
  charCount.textContent = `${postText.value.length}/240`;
});

// Create a post
postBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  const text = postText.value.trim();
  if (!user) return alert('Please sign in first.');
  if (!text) return;
  postBtn.disabled = true;
  try {
    await addDoc(collection(db, 'posts'), {
      uid: user.uid,
      name: user.displayName || 'Anonymous',
      photoURL: user.photoURL || '',
      text,
      createdAt: serverTimestamp()
    });
    postText.value = '';
    charCount.textContent = '0/240';
  } catch (e) {
    alert('Failed to post: ' + e.message);
  } finally {
    postBtn.disabled = false;
  }
});

// Live feed
const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
onSnapshot(q, (snap) => {
  feed.innerHTML = '';
  snap.forEach((doc) => {
    const p = doc.data();
    const el = document.createElement('div');
    el.className = 'post';
    el.innerHTML = `
      <div class="meta">
        <strong>${p.name ?? 'User'}</strong> • ${p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : '…'}
      </div>
      <div class="content">${escapeHtml(p.text || '')}</div>
    `;
    feed.appendChild(el);
  });
});

// simple sanitizer
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
