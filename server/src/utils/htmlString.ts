export const rejectForm = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>매거진 등록 거절</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
        .title {
          color: #f44336;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .form-group textarea {
          width: 100%;
          min-height: 100px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .submit-btn {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .cancel-btn {
          background-color: #ccc;
          color: #333;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-right: 10px;
        }
      </style>
    </head>
    <body>
      <div class="title">매거진 등록 거절</div>
      <p>해당 매거진 등록 요청을 거절하시겠습니까?</p>
      <form id="rejectForm" method="post">
        <div class="form-group">
          <label for="reason">거절 사유:</label>
          <textarea id="reason" name="reason" placeholder="사용자에게 전달될 거절 사유를 입력하세요..."></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="cancel-btn" onclick="window.close()">취소</button>
          <button type="submit" class="submit-btn">거절하기</button>
        </div>
      </form>
      <script>
        document.getElementById('rejectForm').addEventListener('submit', function(e) {
          e.preventDefault();
          const reason = document.getElementById('reason').value;
          
          fetch(window.location.href, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason: reason }),
          })
          .then(response => {
            if (response.ok) {
              // 성공적으로 거절 처리됨
              return response.text();
            }
            throw new Error('거절 처리 실패');
          })
          .then(html => {
            document.open();
            document.write(html);
            document.close();
          })
          .catch(error => {
            console.error('Error:', error);
            alert('거절 처리 중 오류가 발생했습니다: ' + error.message);
          });
        });
      </script>
    </body>
    </html>
  `;
