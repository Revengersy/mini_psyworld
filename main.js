import FirebaseAction from "./firebase/action.js";

const firebaseAction = new FirebaseAction("comments");

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

      await firebaseAction.save(doc);
      event.target.reset();
      alert("댓글이 등록되었습니다.");
      renderComments();
  })

  // 불러오기
  async function renderComments() {
      let str = "";

      const data = await firebaseAction.findAll();

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
          await firebaseAction.deleteById(id);
          await renderComments();
      }
      else {
        alert("비밀번호가 틀렸습니다");
      }
  });