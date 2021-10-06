const dictionaryAPI = "https://api.dictionaryapi.dev/api/v2/entries/en_US/";
const defineInput = document.getElementById("define-input");
const defineBtn = document.getElementById("define-btn");
defineBtn.addEventListener("click", fetchDefinition);

function prepareOutputSection(id, header) {
  const section = document.getElementById(id);
  section.innerHTML = "";
  const h1 = document.createElement("h1");
  h1.classList = "title";
  h1.textContent = header;
  section.appendChild(h1);
  return section;
}

function displayPhonetic(phoneticSection, {text, audio}) {
  const article = document.createElement("article");
  article.className = "message is-medium";

  const header = document.createElement("div");
  header.className = "message-header";
  header.innerHTML = `<p>${text}</p>`;
  article.appendChild(header);

  const body = document.createElement("div");
  body.className = "message-body";
  const audioControl = document.createElement("audio");
  audioControl.style = "width: 100%";
  audioControl.setAttribute("controls", "true");
  const source = document.createElement("source");
  source.setAttribute("src", audio);
  source.setAttribute("type", "audio/mpeg");
  audioControl.appendChild(source);
  audioControl.appendChild(document.createTextNode("Your browser does not support the audio element."));
  body.appendChild(audioControl);
  article.appendChild(body);
  phoneticSection.appendChild(article);
}

function displayPhonetics(data) {
  const phoneticSection = prepareOutputSection("phonetics", "Phonetics");
  if (data && data.phonetics) {
    data.phonetics.forEach(item => displayPhonetic(phoneticSection, item));
  }
}

function displayMeaning(div, definitions) {
  const unorderedList = document.createElement("ul");
  unorderedList.style = "margin-top: 0";
  definitions.forEach(element => {
    const item = document.createElement("li");
    item.textContent = element.definition;
    unorderedList.appendChild(item);
  });
  div.appendChild(unorderedList);
}

function displayDefinition(definitionSection, {partOfSpeech, definitions}) {
  const article = document.createElement("article");
  article.className = "message is-info is-medium";

  const header = document.createElement("div");
  header.className = "message-header";
  header.innerHTML = `<p>${partOfSpeech}</p>`;
  article.appendChild(header);

  const body = document.createElement("div");
  body.className = "message-body";
  const content = document.createElement("div");
  content.className = "content";
  displayMeaning(content, definitions);
  body.appendChild(content);
  article.appendChild(body);
  definitionSection.appendChild(article);
}

function displayDefinitions(data) {
  const definitionSection = prepareOutputSection("definitions", "Definitions");
  if (data && data.meanings) {
    data.meanings.forEach(item => displayDefinition(definitionSection, item));
  }
}

function displayFetchedData(data) {
  displayPhonetics(data);
  displayDefinitions(data);
}

function fetchDefinition(event) {
  event.preventDefault();
  const wordToDefine = defineInput.value;
  fetch(`${dictionaryAPI}${wordToDefine}`)
    .then((response) => response.json())
    .then(data => displayFetchedData(data[0]))
    .catch(err => console.log(err));
}
