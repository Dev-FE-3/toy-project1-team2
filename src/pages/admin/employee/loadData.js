const loadJSONToLocalStorage = (key) => {
  if (!localStorage.getItem(key)) {
    fetch (`/src/data/${key}.json`)
      .then (res => {
        if (!res.ok) throw new Error("Network response was not ok.");
        return res.json(); // JSON으로 변환
      })
      .then (data => {
        // 로컬스토리지에 저장
        localStorage.setItem(key, JSON.stringify(data));
        console.info("Data has been saved to local storage.")
      })
      .catch (err => {
        console.error("Error occurred while fetching the JSON file:", err);
      });
  }
}

export default loadJSONToLocalStorage;