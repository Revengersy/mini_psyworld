import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

  const firebaseConfig = {
      apiKey: "AIzaSyB-VPC_E8wRqgNZFYmeZ-Yb1OaF9ctoiKE",
      authDomain: "sparta-805ba.firebaseapp.com",
      projectId: "sparta-805ba",
      storageBucket: "sparta-805ba.firebasestorage.app",
      messagingSenderId: "956226350011",
      appId: "1:956226350011:web:8ebf1188ae5c29a73af29e",
      measurementId: "G-V6BYS10MZS"
  };

  // Firebase 인스턴스 초기화
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // 전송
  $("#comment-form").submit(async function (event) {
      event.preventDefault();
      let author = $('#author').val();
      let content = $('#content').val();
      let pw = $('#pw').val();
      const date = new Date();
      const formatted = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
      const doc = {
          'author': author,
          'content': content,
          'date': formatted,
          'pw': pw
      };

      await addDoc(collection(db, "comments"), doc);
      event.target.reset();
      alert("댓글이 등록되었습니다.");

      renderComments();
  })

  // 불러오기
  async function renderComments() {
      const data = [];
      let str = "";

      let docs = await getDocs(collection(db, "comments"));
      docs.forEach((doc) => {
          const result = { ...doc.data(), id: doc.id };
          data.push(result);

      });

      data
          .sort((docA, docB) => {
              return new Date(docA['date']) - new Date(docB['date']);
          }) // 정렬
          .forEach((row) => {
              let author = row['author'];
              let content = row['content'];
              let date = row['date'];
              let id = row['id'];
              let pw = row['pw']; // 추후 해시 알고리즘 구현


              str += `<div>
                        <div class="comment-item comment-item--header">
                          <span>${author}</span>
                          <span>${date}</span>
                          <button class="comment-delete" data-id=${id} data-pw=${pw}>삭제</button>
                        </div>
                        <div class="comment-item">${content} </div>
                      </div>
                      `;

          });


      $("#comment-contents").html(str);
  }
  await renderComments();

  //삭제
  $(document).on('click', '.comment-delete', async function (event) {
      const id = event.target.getAttribute('data-id');
      const pw = event.target.getAttribute('data-pw');
      var userInput = prompt("당신의 비밀번호를 입력하세요");

      if (userInput == pw) {
          await deleteDoc(doc(db, "comments", id));
          await renderComments();
      }
      else {
        alert("비밀번호가 틀렸습니다");
      }
  });