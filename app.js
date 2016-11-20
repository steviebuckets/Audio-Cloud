function getDataFromApi() {
	$.getJSON("https://itunes.apple.com/search?parameterkeyvalue"), {
		term: "espn",
		media: podcast,
		entity: podcast,
		attribute: podcast,
		callback: wsSearchCB,
		limit: 12

	})
}