import { Afroradiohead.ComPage } from './app.po';

describe('afroradiohead.com App', () => {
  let page: Afroradiohead.ComPage;

  beforeEach(() => {
    page = new Afroradiohead.ComPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
