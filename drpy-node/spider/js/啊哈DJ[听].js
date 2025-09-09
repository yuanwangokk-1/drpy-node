/*
@header({
  searchable: 2,
  filterable: 0,
  quickSearch: 0,
  title: '啊哈DJ[听]',
  '类型': '影视',
  lang: 'ds'
})
*/

var rule = {
    title: '啊哈DJ[听]',
    host: 'https://m.ahadj.com',
    url: '/music/id-fyclass-fypage.html',
    class_parse: 'body&&.sort&&a;a&&Text;a&&href;(\\d+)',
    hikerListCol: "movie_2",
    hikerClassListCol: "movie_2",
    searchable: 2,
    quickSearch: 0,
    filterable: 0,
    headers: {
        'User-Agent': 'MOBILE_UA',
    },
    play_parse: true,
    lazy: async function () {
        let {input, pdfh} = this;
        // console.log('input:', input);
        let html = await request(input);
        let _url = pdfh(html, 'video&&source&&src');
        return {parse: 0, url: _url, js: ''};
    },
    推荐: '*',
    searchUrl: '/search/?key=**&page=fypage.html',
    一级: '.yinyue_list&&li;a--span--span--span&&Text;img&&src;span&&Text;a&&href',
    二级: '*',
    搜索: '*',
}