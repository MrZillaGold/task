export const onOpen = () => {
  const menu = SlidesApp.getUi()
    .createMenu('PDF to Slides')
    .addItem('Convert PDF to Slides', 'openMain');

  menu.addToUi();
};

export const openMain = () => {
  const html = HtmlService.createHtmlOutputFromFile('main-sidebar');
  SlidesApp.getUi().showSidebar(html);
};
