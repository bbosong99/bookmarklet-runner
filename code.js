(() => {
  try {
    const clickNpayAndExtract = () => {
      const npayBtn = [...document.querySelectorAll('a.subFilter_filter__KS6xJ')]
        .find(a => a.innerText.trim() === '네이버페이');
      if (npayBtn) {
        npayBtn.click();
        console.log("🟢 '네이버페이' 버튼 클릭됨");
        setTimeout(() => waitForAllSortRequest(), 1500);
      } else {
        alert("❌ '네이버페이' 버튼을 찾지 못했습니다.");
      }
    };

    const waitForAllSortRequest = (retry = 0) => {
      const url = performance.getEntriesByType("resource")
        .map(e => e.name)
        .find(url => url.includes("/api/search/all?sort="));
      if (url) {
        fetch(url)
          .then(r => r.text())
          .then(text => {
            try {
              const json = JSON.parse(text);
              const pretty = JSON.stringify(json, null, 2);
              navigator.clipboard.writeText(pretty).then(() => {
                alert("📋 Preview 복사 완료!\nConsole에서 확인하세요.");
                console.log("✅ 응답 전체:", json);
              });
            } catch (e) {
              alert("❌ JSON 파싱 실패\nConsole에 원문 출력");
              console.log("응답 원문:", text);
            }
          })
          .catch(err => {
            alert("❌ 요청 실패: " + err.message);
            console.error(err);
          });
      } else if (retry < 30) {
        setTimeout(() => waitForAllSortRequest(retry + 1), 300);
      } else {
        alert("❌ all?sort= 요청을 찾지 못했습니다.");
      }
    };

    clickNpayAndExtract();
  } catch (e) {
    alert("❌ 실행 오류: " + e.message);
    console.error(e);
  }
})();
