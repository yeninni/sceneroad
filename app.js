/* SceneRoad 프로토타입 동작 */
(function () {
  'use strict';

  /* ---------------- 화면 정의 ---------------- */
  var SCREENS = [
    { id: 'home', label: '방문객 홈' },
    { id: 'partner', label: '씬로드 파트너' },
    { id: 'course', label: '도보 코스' },
    { id: 'spots', label: '로컬 스팟' }
  ];

  var STATUS_BAR = '<div class="statusbar"><span>9:41</span><span class="statusbar__icons">' +
    '<svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="4.5" y="6" width="3" height="6" rx="1"/><rect x="9" y="3.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="1" width="3" height="11" rx="1"/></svg>' +
    '<svg viewBox="0 0 16 12" aria-hidden="true"><path d="M8 10.6 5.6 8.2a3.4 3.4 0 0 1 4.8 0L8 10.6Z"/><path d="M2.8 5.4a7.4 7.4 0 0 1 10.4 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
    '<svg viewBox="0 0 26 12" aria-hidden="true"><rect x="0.5" y="1" width="20" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="2.5" y="3" width="14" height="6" rx="1.6"/><rect x="22.5" y="4" width="2.4" height="4" rx="1.2"/></svg>' +
    '</span></div>';

  /* ---------------- 상점 데이터 ---------------- */
  var SPOTS = [
    {
      id: 'onmigwan', cat: 'korean', rating: 4.6, count: 213, dist: 260, walk: 4, menuEn: true,
      img: 'assets/spot-onmigwan.jpg', alt: '온미관 안국 한식 상차림',
      name: { kr: '온미관 안국', en: 'Onmigwan Anguk', jp: 'オンミグァン 安国' },
      note: { kr: '감고당길 골목 안쪽, 모던 한식 다이닝', en: 'Modern Korean dining inside the alley', jp: '路地の奥のモダン韓国料理' },
      scene: { kr: '사내맞선 5화 저녁 장면', en: 'Business Proposal ep.5 dinner', jp: '社内お見合い5話の夕食シーン' },
      tastes: ['food', 'friends', 'drama']
    },
    {
      id: 'dotblanket', cat: 'cafe', rating: 4.8, count: 486, dist: 320, walk: 5, menuEn: true,
      img: 'assets/spot-dotblanket.jpg', alt: '도트블랭킷 브런치 팬케이크',
      name: { kr: '도트블랭킷', en: 'Dot Blanket', jp: 'ドットブランケット' },
      note: { kr: '유럽식 브런치와 플레이티드 디저트', en: 'European brunch and plated desserts', jp: '欧風ブランチとデザート' },
      scene: { kr: '사내맞선 2화 카페 장면', en: 'Business Proposal ep.2 cafe', jp: '社内お見合い2話のカフェシーン' },
      tastes: ['friends', 'solo', 'drama']
    },
    {
      id: 'tea', cat: 'tea', rating: 4.6, count: 152, dist: 380, walk: 6, menuEn: true,
      img: 'assets/spot-teatherapy.jpg', alt: '티테라피 행랑점 한옥 골목',
      name: { kr: '티테라피 행랑점', en: 'Tea Therapy Haengnang', jp: 'ティーテラピー 行廊店' },
      note: { kr: '고즈넉한 한옥 전통 찻집', en: 'A quiet hanok tea house', jp: '静かな韓屋の伝統茶屋' },
      scene: { kr: '드라마 배경이 된 한옥 찻집', en: 'Hanok tea house seen in dramas', jp: 'ドラマの背景になった韓屋茶屋' },
      tastes: ['hanok', 'solo', 'drama']
    },
    {
      id: 'film', cat: 'shop', rating: 4.9, count: 64, dist: 210, walk: 3, menuEn: false,
      img: 'assets/spot-film.jpg', alt: '안국 필름상회 필름 카메라 진열',
      name: { kr: '안국 필름상회', en: 'Anguk Film Club', jp: 'アングク フィルム商會' },
      note: { kr: '필름 카메라 대여와 현상소', en: 'Film camera rental and lab', jp: 'フィルムカメラのレンタルと現像' },
      scene: { kr: '필름 감성 사진 스팟', en: 'Film-look photo spot', jp: 'フィルム写真スポット' },
      tastes: ['drama', 'solo', 'friends']
    },
    {
      id: 'mandu', cat: 'korean', rating: 4.7, count: 391, dist: 150, walk: 2, menuEn: false,
      img: 'assets/spot-mandu.jpg', alt: '골목 왕만두 김 오르는 한 접시',
      name: { kr: '골목 왕만두', en: 'Golmok Wangmandu', jp: 'コルモク ワンマンドゥ' },
      note: { kr: '줄 서는 골목 왕만두집', en: 'Alley dumpling shop worth the queue', jp: '行列の路地マンドゥ屋' },
      scene: { kr: '골목 분식 산책 코스', en: 'Alley snack stop', jp: '路地スナックの立ち寄り' },
      tastes: ['food', 'solo']
    }
  ];

  var TASTE_ORDER = ['drama', 'food', 'hanok', 'solo', 'friends'];
  var COURSE_ORDER = {
    drama: ['tea', 'dotblanket', 'film'],
    food: ['mandu', 'onmigwan', 'dotblanket'],
    hanok: ['tea', 'onmigwan', 'film'],
    solo: ['film', 'tea', 'mandu'],
    friends: ['onmigwan', 'dotblanket', 'film']
  };
  var DEFAULT_LIST = ['onmigwan', 'dotblanket', 'tea', 'film', 'mandu'];

  /* ---------------- 문구 ---------------- */
  var I18N = {
    kr: {
      all: '전체', seeAll: '전체 보기', nearby: '지금 취향에 맞는 스팟', tasteTitle: '여행 취향',
      tasteHint: '하나만 골라도 코스가 바뀝니다', tasteCount: '{n}개 선택', tasteNone: '골라 보세요',
      menuOnly: '영어 메뉴만', listHead: '촬영지에서 걸어서 10분 이내', spotsTitle: '안국 주변 로컬 스팟',
      mapChip: '안국 (종로구)', emptyCourse: '이 코스에 등록된 상점이 아직 없습니다.',
      emptySpots: '조건에 맞는 상점이 아직 없습니다. 곧 추가됩니다.',
      spotNote: '영업시간과 영어 메뉴 운영은 방문 당일 매장 사정에 따라 달라질 수 있습니다.',
      courseNote: '도보 시간은 현장 사정에 따라 조금 달라질 수 있습니다.',
      startWalk: '도보 동선 시작하기', walking: '동선 안내 중 {n}/3', stopWalk: '동선 안내 멈추기', replayWalk: '동선 다시 보기',
      guideDefault: '취향을 눌러 봐. 코스랑 스팟을 바로 바꿔 줄게.',
      match: '추천 이유', walkUnit: '도보 {n}분',
      summary: '{spots}곳, 도보 {min}분, 영어 메뉴 {en}곳',
      summaryShort: '{spots}곳, 도보 {min}분, 영어 메뉴 {en}곳',
      summaryRoute: '도보 {min}분, 영어 메뉴 {en}곳',
      partnerTitle: '씬로드 파트너', regionAnguk: '안국 지역', regionBukchon: '북촌 지역',
      regionIkseon: '익선동 지역', regionSeochon: '서촌 지역', soon: '준비 중',
      kpiWalk: '보행 점수 (500m)', kpiPoint: '점', kpiWalkDelta: '전주 대비 +24%',
      kpiForeign: '외국인 소비 비중', kpiForeignDelta: '전주 대비 +8.1%p',
      chartTitle: '시간대별 방문 흐름', chartPeak: '15시 피크',
      insightTitle: '픽셀 가이드가 짠 오늘의 코스',
      insightText: '{course}를 고른 방문객이 38%예요.',
      tipsTitle: '오늘의 운영 팁',
      tip1: '14시부터 16시가 가장 붐비는 시간대입니다.',
      tip2: '외국인 방문이 많은 날은 메뉴판 영문 표기를 챙겨 주세요.',
      tip3: '예상 대기 시간을 안내하면 매장 만족도가 높아집니다.',
      partnerNote: '데이터 기준 2026년 11월 셋째 주',
      qDrama: '드라마', qRoute: '도보 동선', qSpots: '로컬 스팟', qMore: '더보기',
      tabHome: '홈', tabExplore: '탐색', tabMap: '지도', tabSaved: '저장', tabRoute: '동선',
      tabSpots: '로컬 스팟', tabReviews: '리뷰', tabDash: '대시보드', tabVisitors: '방문자 분석',
      tabCampaign: '캠페인', tabAccount: '내 정보',
      catAll: '전체', catKorean: '한식', catCafe: '카페', catTea: '전통찻집', catShop: '상점',
      catName: { korean: '한식당', cafe: '브런치 카페', tea: '한옥 찻집', shop: '필름 상점' },
      toastDrama: '드라마 목록은 프로토타입에서 예시로만 열립니다.',
      toastMore: '더보기 메뉴는 프로토타입에서 준비 중입니다.',
      toastSaved: '저장한 코스는 프로토타입에서 예시로만 열립니다.',
      toastDash: '대시보드가 열려 있습니다.',
      toastVisitors: '방문자 분석은 프로토타입에서 예시로만 열립니다.',
      toastCampaign: '캠페인 화면은 프로토타입에서 준비 중입니다.',
      toastAccount: '매장 정보 화면은 프로토타입에서 준비 중입니다.',
      toastReviews: '리뷰 화면은 프로토타입에서 예시로만 열립니다.',
      toastLimit: '취향은 3개까지 고를 수 있어요.',
      toastWalk: '안국 도보 코스를 시작합니다. 1번 {name}까지 도보 {n}분입니다.',
      toastWalkOff: '동선 안내를 멈췄습니다.',
      taste: {
        drama: { label: 'K-드라마 로맨스', badge: 'SBS 드라마', title: '사내맞선 로맨스 촬영지 코스', sub: '서울 종로구 안국동 감고당길, 도보 1.4km', guide: '사내맞선 촬영지부터 안내할게. 3화 엔딩 골목이 여기서 5분이야.', course: '사내맞선 안국 로맨스 코스', lead: '촬영지 세 곳만 순서대로 골랐어.' },
        food: { label: '골목 맛집', badge: '로컬 맛집', title: '감고당길 골목 맛집 산책', sub: '안국역 3번 출구에서 도보 2분', guide: '골목 맛집부터 갈까? 점심엔 만두집 줄이 짧아.', course: '감고당길 골목 맛집 코스', lead: '배고플 때 걷기 좋은 순서야.' },
        hanok: { label: '한옥 카페', badge: '한옥 카페', title: '한옥 카페에서 보내는 느린 오후', sub: '운보살길 골목자락, 도보 1.1km', guide: '한옥 찻집부터 천천히 걷자. 오후 두 시엔 창가 자리가 비어.', course: '한옥 카페 느린 오후 코스', lead: '앉아서 쉬는 시간까지 넣었어.' },
        solo: { label: '혼자 걷기', badge: '혼자 여행', title: '혼자 걷기 좋은 안국 골목', sub: '조용한 오전 시간 추천, 도보 1.3km', guide: '사람 적은 길로만 골랐어. 혼자 걷기 좋은 순서야.', course: '혼자 걷는 안국 골목 코스', lead: '붐비는 시간은 피해서 짰어.' },
        friends: { label: '친구와 함께', badge: '친구와 함께', title: '친구와 사진 찍기 좋은 코스', sub: '필름 카메라 대여까지, 도보 1.5km', guide: '사진 찍기 좋은 자리부터 모았어. 셋이 서면 딱 맞아.', course: '친구와 사진 찍는 코스', lead: '사진 남기기 좋은 곳 위주야.' }
      },
      heroDefault: { badge: 'SBS 드라마', title: '사내맞선 촬영지 투어', sub: '서울 종로구 안국동 감고당길, 도보 1.4km' }
    },

    en: {
      all: 'All', seeAll: 'See all', nearby: 'Spots that fit your taste', tasteTitle: 'Travel taste',
      tasteHint: 'Pick one and the course changes', tasteCount: '{n} picked', tasteNone: 'Pick one',
      menuOnly: 'English menu', listHead: 'Within 10 minutes on foot', spotsTitle: 'Local spots near Anguk',
      mapChip: 'Anguk, Jongno-gu', emptyCourse: 'No shop is registered on this course yet.',
      emptySpots: 'Nothing matches this filter yet. More shops are coming.',
      spotNote: 'Opening hours and English menus can change on the day of your visit.',
      courseNote: 'Walking times can shift a little on the day of your visit.',
      startWalk: 'Start the walk course', walking: 'Route preview · Stop {n} of 3', stopWalk: 'Stop route preview', replayWalk: 'Replay route',
      guideDefault: 'Tap a taste and I will swap the course and spots for you.',
      match: 'Why this pick', walkUnit: '{n} min walk',
      summary: '{spots} stops, {min} min on foot, {en} with English menu',
      summaryShort: '{spots} stops, {min} min, {en} EN menus',
      summaryRoute: '{min} min on foot, {en} with an English menu',
      partnerTitle: 'SceneRoad Partner', regionAnguk: 'Anguk area', regionBukchon: 'Bukchon area',
      regionIkseon: 'Ikseon area', regionSeochon: 'Seochon area', soon: 'Soon',
      kpiWalk: 'Walk score (500m)', kpiPoint: 'pt', kpiWalkDelta: '+24% vs last week',
      kpiForeign: 'Foreign spending share', kpiForeignDelta: '+8.1%p vs last week',
      chartTitle: 'Visitor flow by hour', chartPeak: '3 PM peak',
      insightTitle: "Today's course, picked by the guide",
      insightText: '38% of visitors chose {course}.',
      tipsTitle: "Today's operation tips",
      tip1: '14:00 to 16:00 is the busiest window of the day.',
      tip2: 'On days with many foreign visitors, keep the English menu ready.',
      tip3: 'Telling guests the expected wait keeps satisfaction high.',
      partnerNote: 'Data based on the third week of November 2026',
      qDrama: 'Drama', qRoute: 'Walk route', qSpots: 'Local spots', qMore: 'More',
      tabHome: 'Home', tabExplore: 'Explore', tabMap: 'Map', tabSaved: 'Saved', tabRoute: 'Route',
      tabSpots: 'Spots', tabReviews: 'Reviews', tabDash: 'Dashboard', tabVisitors: 'Visitors',
      tabCampaign: 'Campaign', tabAccount: 'Account',
      catAll: 'All', catKorean: 'Korean', catCafe: 'Cafe', catTea: 'Tea house', catShop: 'Shop',
      catName: { korean: 'Korean', cafe: 'Brunch cafe', tea: 'Hanok tea', shop: 'Film shop' },
      toastDrama: 'The drama list opens as an example only.',
      toastMore: 'The more menu is not connected in this prototype yet.',
      toastSaved: 'Saved courses open as an example only.',
      toastDash: 'The dashboard is open.',
      toastVisitors: 'Visitor analytics opens as an example only.',
      toastCampaign: 'The campaign screen is not ready in this prototype.',
      toastAccount: 'The store profile is not ready in this prototype.',
      toastReviews: 'Reviews open as an example only.',
      toastLimit: 'You can pick up to 3 tastes.',
      toastWalk: 'Walk route started. {name} is {n} minutes away.',
      toastWalkOff: 'Route guidance stopped.',
      taste: {
        drama: { label: 'K-drama romance', badge: 'SBS drama', title: 'Business Proposal romance route', sub: 'Gamgodang-gil, Anguk-dong, Seoul, 1.4 km on foot', guide: 'I will start with the Business Proposal spots. The ep.3 ending alley is 5 minutes away.', course: 'Business Proposal Anguk romance', lead: 'Three filming spots, in walking order.' },
        food: { label: 'Alley food', badge: 'Local food', title: 'Gamgodang-gil food alley walk', sub: '2 min from Anguk Station exit 3', guide: 'Food first? The dumpling queue is short before noon.', course: 'Gamgodang-gil food alley course', lead: 'An order that works when you are hungry.' },
        hanok: { label: 'Hanok cafe', badge: 'Hanok cafe', title: 'A slow afternoon in a hanok cafe', sub: 'Unbosan-gil alley, 1.1 km on foot', guide: 'Let us start with the hanok tea house. Window seats open around 2 PM.', course: 'Hanok cafe slow afternoon', lead: 'I left time to sit and rest.' },
        solo: { label: 'Solo walk', badge: 'Solo trip', title: 'Quiet Anguk alleys for a solo walk', sub: 'Best in the quiet morning, 1.3 km on foot', guide: 'I picked the streets with the fewest people. A good order to walk alone.', course: 'Solo walk in Anguk alleys', lead: 'I kept you out of the busy hours.' },
        friends: { label: 'With friends', badge: 'With friends', title: 'A route made for photos with friends', sub: 'Film camera rental included, 1.5 km on foot', guide: 'I gathered the photogenic corners first. Three people fit perfectly.', course: 'Photo walk with friends', lead: 'Mostly places worth a photo.' }
      },
      heroDefault: { badge: 'SBS drama', title: 'Business Proposal filming spot tour', sub: 'Gamgodang-gil, Anguk-dong, Seoul, 1.4 km on foot' }
    },

    jp: {
      all: 'すべて', seeAll: 'すべて見る', nearby: '好みに合うスポット', tasteTitle: '旅の好み',
      tasteHint: 'ひとつ選ぶだけでコースが変わります', tasteCount: '{n}件選択', tasteNone: '選んでみて',
      menuOnly: '英語メニュー', listHead: 'ロケ地から徒歩10分以内', spotsTitle: '安国周辺のローカルスポット',
      mapChip: '安国（鍾路区）', emptyCourse: 'このコースに登録されたお店はまだありません。',
      emptySpots: '条件に合うお店はまだありません。順次追加します。',
      spotNote: '営業時間と英語メニューは当日の店舗の状況で変わる場合があります。',
      courseNote: '徒歩時間は当日の状況で少し変わることがあります。',
      startWalk: '徒歩コースを開始', walking: '案内中 {n}/3', stopWalk: '案内を停止', replayWalk: 'コースをもう一度見る',
      guideDefault: '好みを押してみて。コースとスポットをすぐ変えるよ。',
      match: 'おすすめ理由', walkUnit: '徒歩{n}分',
      summary: '{spots}か所、徒歩{min}分、英語メニュー{en}か所',
      summaryShort: '{spots}か所 徒歩{min}分 英語{en}店',
      summaryRoute: '徒歩{min}分、英語メニュー{en}か所',
      partnerTitle: 'シンロード パートナー', regionAnguk: '安国エリア', regionBukchon: '北村エリア',
      regionIkseon: '益善洞エリア', regionSeochon: '西村エリア', soon: '準備中',
      kpiWalk: '歩行スコア (500m)', kpiPoint: '点', kpiWalkDelta: '先週比 +24%',
      kpiForeign: '外国人消費の割合', kpiForeignDelta: '先週比 +8.1%p',
      chartTitle: '時間帯別の来訪の流れ', chartPeak: '15時ピーク',
      insightTitle: 'ガイドが組んだ今日のコース',
      insightText: '{course}を選んだ訪問客が38%です。',
      tipsTitle: '今日の運営ヒント',
      tip1: '14時から16時が最も混み合う時間帯です。',
      tip2: '外国人の来訪が多い日は英語メニューを用意してください。',
      tip3: '待ち時間の目安を伝えると満足度が上がります。',
      partnerNote: 'データ基準 2026年11月第3週',
      qDrama: 'ドラマ', qRoute: '徒歩ルート', qSpots: 'ローカル', qMore: 'もっと',
      tabHome: 'ホーム', tabExplore: '探す', tabMap: '地図', tabSaved: '保存', tabRoute: 'ルート',
      tabSpots: 'スポット', tabReviews: 'レビュー', tabDash: 'ダッシュボード', tabVisitors: '来訪分析',
      tabCampaign: 'キャンペーン', tabAccount: '店舗情報',
      catAll: 'すべて', catKorean: '韓国料理', catCafe: 'カフェ', catTea: '伝統茶屋', catShop: 'お店',
      catName: { korean: '韓国料理', cafe: 'ブランチカフェ', tea: '韓屋茶屋', shop: 'フィルム店' },
      toastDrama: 'ドラマ一覧はサンプルとしてのみ開きます。',
      toastMore: 'もっと見るメニューは準備中です。',
      toastSaved: '保存したコースはサンプルとしてのみ開きます。',
      toastDash: 'ダッシュボードを開いています。',
      toastVisitors: '来訪分析はサンプルとしてのみ開きます。',
      toastCampaign: 'キャンペーン画面は準備中です。',
      toastAccount: '店舗情報画面は準備中です。',
      toastReviews: 'レビュー画面はサンプルとしてのみ開きます。',
      toastLimit: '好みは3つまで選べます。',
      toastWalk: '安国の徒歩コースを開始します。1番{name}まで徒歩{n}分です。',
      toastWalkOff: '案内を止めました。',
      taste: {
        drama: { label: 'Kドラマ ロマンス', badge: 'SBSドラマ', title: '社内お見合い ロマンスロケ地コース', sub: 'ソウル 安国洞 カムゴダンギル、徒歩1.4km', guide: '社内お見合いのロケ地から案内するね。3話ラストの路地はここから徒歩5分。', course: '社内お見合い 安国ロマンス', lead: 'ロケ地3か所だけを順番に選んだよ。' },
        food: { label: '路地グルメ', badge: '地元グルメ', title: 'カムゴダンギル 路地グルメ散歩', sub: '安国駅3番出口から徒歩2分', guide: '路地グルメから行く？お昼前はマンドゥ屋の列が短いよ。', course: 'カムゴダンギル グルメ散歩', lead: 'お腹が空いた時にいい順番だよ。' },
        hanok: { label: '韓屋カフェ', badge: '韓屋カフェ', title: '韓屋カフェでゆっくり午後', sub: '雲宝山キルの路地、徒歩1.1km', guide: '韓屋の茶屋からゆっくり歩こう。午後2時なら窓際が空いてるよ。', course: '韓屋カフェ ゆっくり午後', lead: '座って休む時間も入れてあるよ。' },
        solo: { label: 'ひとり歩き', badge: 'ひとり旅', title: 'ひとり歩きにいい安国の路地', sub: '静かな午前がおすすめ、徒歩1.3km', guide: '人が少ない道だけを選んだよ。ひとりで歩くのにいい順番。', course: 'ひとり安国路地散歩', lead: '混む時間は避けて組んだよ。' },
        friends: { label: '友達と一緒', badge: '友達と一緒', title: '友達と写真を撮るコース', sub: 'フィルムカメラのレンタルも、徒歩1.5km', guide: '写真が映える場所から集めたよ。3人で立つとちょうどいい。', course: '友達と写真散歩', lead: '写真を残したい場所中心だよ。' }
      },
      heroDefault: { badge: 'SBSドラマ', title: '社内お見合い ロケ地ツアー', sub: 'ソウル 安国洞 カムゴダンギル、徒歩1.4km' }
    }
  };

  /* ---------------- 상태 ---------------- */
  var state = { lang: 'kr', tastes: [], menuOnly: false, walkElapsed: null, filter: { course: 'all', spots: 'all' }, current: 'home' };
  var WALK_STOP_MS = 500;
  var WALK_LEG_MS = 1950;
  var WALK_TOTAL_MS = WALK_LEG_MS * 2;
  var walkFrame;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function T(key) { return I18N[state.lang][key]; }
  function tasteData(id) { return I18N[state.lang].taste[id]; }
  function fmt(str, map) {
    return str.replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function byId(id) { for (var i = 0; i < SPOTS.length; i++) if (SPOTS[i].id === id) return SPOTS[i]; return null; }
  function primaryTaste() { return state.tastes[0] || null; }

  function courseSpots() {
    var key = primaryTaste() || 'drama';
    return COURSE_ORDER[key].map(byId);
  }

  function rankedSpots() {
    if (!state.tastes.length) return DEFAULT_LIST.map(byId);
    return SPOTS.slice().sort(function (a, b) {
      var sa = a.tastes.filter(function (t) { return state.tastes.indexOf(t) >= 0; }).length;
      var sb = b.tastes.filter(function (t) { return state.tastes.indexOf(t) >= 0; }).length;
      if (sb !== sa) return sb - sa;
      return DEFAULT_LIST.indexOf(a.id) - DEFAULT_LIST.indexOf(b.id);
    });
  }

  /* ---------------- 공통 조각 ---------------- */
  function tasteChips() {
    return TASTE_ORDER.map(function (id) {
      var on = state.tastes.indexOf(id) >= 0;
      return '<button type="button" class="tchip' + (on ? ' is-on' : '') + '" data-taste="' + id + '" aria-pressed="' + on + '">' +
        (on ? '<svg class="ic tchip__tick"><use href="#i-check"/></svg>' : '') +
        '<span>' + esc(tasteData(id).label) + '</span></button>';
    }).join('');
  }

  function walkBadge(spot) {
    return '<span class="badge badge--walk">' + fmt(T('walkUnit'), { n: spot.walk }) + '</span>';
  }
  function enBadge(spot) {
    return spot.menuEn ? '<span class="badge badge--en">EN</span>' : '';
  }

  /* ---------------- 화면 렌더 ---------------- */
  function renderHome(screen) {
    var t = primaryTaste();
    var hero = t ? tasteData(t) : I18N[state.lang].heroDefault;
    screen.querySelector('[data-hero="badge"]').textContent = hero.badge;
    screen.querySelector('[data-hero="title"]').textContent = hero.title;
    screen.querySelector('[data-hero="sub"]').textContent = hero.sub;

    screen.querySelector('[data-taste-chips]').innerHTML = tasteChips();
    screen.querySelector('[data-taste-count]').textContent = state.tastes.length
      ? fmt(T('tasteCount'), { n: state.tastes.length })
      : T('tasteNone');
    screen.querySelector('[data-guide="home"]').textContent = t ? tasteData(t).guide : T('guideDefault');

    var course = courseSpots();
    var total = course.reduce(function (s, x) { return s + x.walk; }, 0);
    var en = course.filter(function (x) { return x.menuEn; }).length;
    screen.querySelector('[data-rec="title"]').textContent = t ? tasteData(t).course : tasteData('drama').course;
    screen.querySelector('[data-rec="desc"]').textContent = fmt(T('summaryShort'), { spots: course.length, min: total, en: en });

    screen.querySelector('[data-home-spots]').innerHTML = rankedSpots().slice(0, 3).map(function (s) {
      return '<button type="button" class="spot-mini" data-go="spots">' +
        '<span class="spot-mini__img"><img src="' + s.img + '" alt="' + esc(s.alt) + '" loading="lazy"></span>' +
        '<span class="spot-mini__name">' + esc(s.name[state.lang]) + '</span>' +
        '<span class="spot-mini__meta"><i class="rating">★ ' + s.rating.toFixed(1) + '</i><span>' + esc(T('catName')[s.cat]) + '</span></span>' +
        (s.menuEn ? '<span class="spot-mini__en">EN</span>' : '') +
        '</button>';
    }).join('');
  }

  function renderCourse(screen) {
    var t = primaryTaste();
    var title = t ? tasteData(t).course : tasteData('drama').course;
    screen.querySelector('[data-course-title]').textContent = title;

    var course = courseSpots();
    var total = course.reduce(function (s, x) { return s + x.walk; }, 0);
    var en = course.filter(function (x) { return x.menuEn; }).length;
    var lead = t ? tasteData(t).lead : tasteData('drama').lead;
    screen.querySelector('[data-guide="course"]').textContent = lead + ' ' + fmt(T('summaryRoute'), { min: total, en: en });

    screen.querySelector('[data-course-steps]').innerHTML = course.map(function (s, i) {
      return '<li class="step" data-cat="' + s.cat + '">' +
        '<span class="step__num">' + (i + 1) + '</span>' +
        '<span class="step__img"><img src="' + s.img + '" alt="' + esc(s.alt) + '" loading="lazy"></span>' +
        '<span class="step__text">' +
          '<span class="step__row"><span class="step__name">' + esc(s.name[state.lang]) + '</span>' + enBadge(s) + '</span>' +
          '<span class="step__meta"><span class="step__scene">' + esc(s.scene[state.lang]) + '</span>' + walkBadge(s) + '</span>' +
        '</span>' +
        '</li>';
    }).join('');

    renderWalk(screen);
    applyFilter(screen, 'course');
  }

  function renderWalk(screen) {
    var elapsed = state.walkElapsed;
    var active = elapsed !== null && elapsed < WALK_TOTAL_MS;
    var stop = Math.floor((elapsed || 0) / WALK_LEG_MS);
    var legElapsed = (elapsed || 0) % WALK_LEG_MS;
    var fraction = active && !reducedMotion.matches
      ? Math.max(0, (legElapsed - WALK_STOP_MS) / (WALK_LEG_MS - WALK_STOP_MS))
      : 0;
    var nodes = screen.querySelectorAll('.mm-node');
    var from = nodes[stop].querySelector('circle');
    var to = nodes[Math.min(stop + 1, nodes.length - 1)].querySelector('circle');
    var x = from.cx.baseVal.value + (to.cx.baseVal.value - from.cx.baseVal.value) * fraction;
    var y = from.cy.baseVal.value + (to.cy.baseVal.value - from.cy.baseVal.value) * fraction;
    var guide = screen.querySelector('.mm-guide');
    guide.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
    guide.classList.toggle('is-moving', fraction > 0);
    nodes.forEach(function (node, index) {
      node.classList.toggle('is-current', index === stop);
    });

    var cta = screen.querySelector('#startWalk');
    var label = cta.querySelector('[data-walk-label]');
    var text = active ? fmt(T('walking'), { n: stop + 1 }) : T(elapsed === null ? 'startWalk' : 'replayWalk');
    if (label.textContent !== text) {
      label.textContent = text;
      cta.setAttribute('aria-label', active ? text + ' · ' + T('stopWalk') : text);
    }
    cta.classList.toggle('is-on', active);
  }

  function renderWalkMaps() {
    document.querySelectorAll('.screen--course').forEach(renderWalk);
  }

  function resetWalk() {
    cancelAnimationFrame(walkFrame);
    state.walkElapsed = null;
  }

  function renderSpots(screen) {
    var list = rankedSpots().filter(function (s) {
      if (state.menuOnly && !s.menuEn) return false;
      return true;
    });
    var btn = screen.querySelector('[data-enonly]');
    if (btn) {
      btn.classList.toggle('is-on', state.menuOnly);
      btn.setAttribute('aria-pressed', state.menuOnly ? 'true' : 'false');
    }
    var t = primaryTaste();
    screen.querySelector('[data-spot-list]').innerHTML = list.map(function (s) {
      var matched = t && s.tastes.indexOf(t) >= 0;
      return '<li class="spotcard" data-cat="' + s.cat + '">' +
        '<span class="spotcard__img"><img src="' + s.img + '" alt="' + esc(s.alt) + '" loading="lazy"></span>' +
        '<div class="spotcard__body">' +
          '<p class="spotcard__name"><span>' + esc(s.name[state.lang]) + '</span>' + enBadge(s) + walkBadge(s) + '</p>' +
          '<p class="spotcard__meta"><span class="cat">' + esc(T('catName')[s.cat]) + '</span><span class="vbar"></span><i class="rating">★ ' + s.rating.toFixed(1) + '</i><span class="count">(' + s.count + ')</span><span class="vbar"></span><span class="dist">' + s.dist + 'm</span></p>' +
          '<p class="spotcard__desc">' + esc(s.note[state.lang]) + '</p>' +
          '<p class="spotcard__why' + (matched ? ' is-match' : '') + '"><svg class="ic ic--xs"><use href="#i-spark"/></svg><span>' + esc(s.scene[state.lang]) + '</span></p>' +
        '</div>' +
        '</li>';
    }).join('');
    applyFilter(screen, 'spots');
  }

  function renderPartner(screen) {
    var t = primaryTaste();
    var course = t ? tasteData(t).course : tasteData('drama').course;
    var titleEl = screen.querySelector('[data-insight="title"]');
    var textEl = screen.querySelector('[data-insight="text"]');
    if (titleEl) titleEl.textContent = T('insightTitle');
    if (textEl) textEl.textContent = fmt(T('insightText'), { course: course });
  }

  function applyFilter(screen, kind) {
    var cat = state.filter[kind];
    var group = screen.querySelector('.chips[data-filter="' + kind + '"]');
    if (group) {
      group.querySelectorAll('.chip').forEach(function (c) {
        c.classList.toggle('is-active', c.dataset.cat === cat);
      });
    }
    var items = screen.querySelectorAll(kind === 'course' ? '.step' : '.spotcard');
    var visible = 0;
    items.forEach(function (it) {
      var show = cat === 'all' || it.dataset.cat === cat;
      it.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    var empty = screen.querySelector('.empty');
    if (empty) empty.hidden = visible > 0;
  }

  function renderScreen(screen) {
    var id = screen.dataset.screen;
    if (id === 'home') renderHome(screen);
    else if (id === 'course') renderCourse(screen);
    else if (id === 'spots') renderSpots(screen);
    else if (id === 'partner') renderPartner(screen);
  }

  function applyAll() {
    document.documentElement.lang = state.lang === 'jp' ? 'ja' : (state.lang === 'en' ? 'en' : 'ko');
    document.querySelectorAll('[data-t]').forEach(function (el) {
      var v = T(el.dataset.t);
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      var on = b.dataset.lang === state.lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('.screen').forEach(renderScreen);
  }

  /* ---------------- 폰 만들기 ---------------- */
  function makePhone(screenId, opts) {
    opts = opts || {};
    var tpl = document.getElementById('tpl-' + screenId);
    var phone = document.createElement('div');
    phone.className = 'phone';
    phone.dataset.screen = screenId;
    phone.appendChild(tpl.content.cloneNode(true));

    var screen = phone.querySelector('.screen');
    var bar = document.createElement('div');
    bar.innerHTML = STATUS_BAR;
    screen.insertBefore(bar.firstChild, screen.firstChild);

    var toast = document.createElement('div');
    toast.className = 'toast';
    screen.appendChild(toast);

    if (opts.static) {
      phone.classList.add('phone--static');
      var hover = document.createElement('span');
      hover.className = 'phone__hover';
      hover.textContent = '눌러서 크게 보기';
      phone.appendChild(hover);
      phone.setAttribute('role', 'button');
      phone.setAttribute('tabindex', '0');
      phone.setAttribute('aria-label', SCREENS.filter(function (s) { return s.id === screenId; })[0].label + ' 화면 크게 보기');
      phone.addEventListener('click', function (e) {
        if (e.target.closest('button')) return;
        openMobile(screenId);
      });
      phone.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMobile(screenId);
        }
      });
    }
    renderScreen(screen);
    return phone;
  }

  function buildOverview() {
    var wrap = document.getElementById('phones');
    SCREENS.forEach(function (s, i) {
      var item = document.createElement('div');
      item.className = 'phones__item';
      var label = document.createElement('div');
      label.className = 'phones__label';
      var num = document.createElement('b');
      num.textContent = '0' + (i + 1);
      label.appendChild(num);
      label.appendChild(document.createTextNode(s.label));
      item.appendChild(label);
      item.appendChild(makePhone(s.id, { static: true }));
      wrap.appendChild(item);
    });
  }

  /* ---------------- 보기 전환 ---------------- */
  function setView(view) {
    document.querySelectorAll('.viewswitch__btn').forEach(function (b) {
      var on = b.dataset.view === view;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    document.querySelectorAll('.view').forEach(function (v) {
      var on = v.id === 'view-' + view;
      v.classList.toggle('is-active', on);
      v.hidden = !on;
    });
    if (view === 'mobile') renderStage();
  }

  function openMobile(screenId) {
    state.current = screenId;
    setView('mobile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderStage() {
    var stage = document.getElementById('stagePhone');
    stage.innerHTML = '';
    stage.appendChild(makePhone(state.current));
    document.querySelectorAll('.rail__btn').forEach(function (b) {
      var on = b.dataset.screen === state.current;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function buildRail() {
    var rail = document.getElementById('rail');
    SCREENS.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'rail__btn';
      b.dataset.screen = s.id;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', s.id === state.current ? 'true' : 'false');
      var num = document.createElement('b');
      num.textContent = '0' + (i + 1);
      b.appendChild(num);
      b.appendChild(document.createTextNode(s.label));
      if (s.id === state.current) b.classList.add('is-active');
      b.addEventListener('click', function () {
        state.current = s.id;
        renderStage();
      });
      rail.appendChild(b);
    });
  }

  /* ---------------- 상호작용 ---------------- */
  function toastIn(node, text) {
    var screen = node.closest('.screen');
    if (!screen) return;
    var t = screen.querySelector('.toast');
    if (!t) return;
    t.textContent = text;
    t.classList.add('is-on');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('is-on'); }, 2800);
  }

  function goScreen(id, fromBtn) {
    var phone = fromBtn.closest('.phone');
    if (!phone || phone.classList.contains('phone--static')) {
      openMobile(id);
      return;
    }
    if (phone.dataset.screen === id) return;
    var fresh = makePhone(id);
    phone.replaceWith(fresh);
    state.current = id;
    document.querySelectorAll('.rail__btn').forEach(function (b) {
      var on = b.dataset.screen === id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function toggleTaste(id, btn) {
    var previousTaste = primaryTaste();
    var i = state.tastes.indexOf(id);
    if (i >= 0) {
      state.tastes.splice(i, 1);
    } else {
      if (state.tastes.length >= 3) { toastIn(btn, T('toastLimit')); return; }
      state.tastes.push(id);
    }
    if (previousTaste !== primaryTaste()) resetWalk();
    applyAll();
  }

  function toggleWalk(btn) {
    if (state.walkElapsed !== null && state.walkElapsed < WALK_TOTAL_MS) {
      resetWalk();
      renderWalkMaps();
      toastIn(btn, T('toastWalkOff'));
      return;
    }

    var first = courseSpots()[0];
    toastIn(btn, fmt(T('toastWalk'), { name: first.name[state.lang], n: first.walk }));
    btn.closest('.screen').querySelector('.minimap').scrollIntoView({ block: 'nearest' });
    var startedAt = performance.now();
    state.walkElapsed = 0;
    renderWalkMaps();
    walkFrame = requestAnimationFrame(function advance(now) {
      state.walkElapsed = Math.min(Math.max(now - startedAt, 0), WALK_TOTAL_MS);
      renderWalkMaps();
      if (state.walkElapsed < WALK_TOTAL_MS) walkFrame = requestAnimationFrame(advance);
    });
  }

  function toggleRegion(btn) {
    var menu = btn.parentNode.querySelector('.region__menu');
    var open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeRegion() {
    document.querySelectorAll('.region__menu').forEach(function (m) { m.hidden = true; });
    document.querySelectorAll('.region__btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.region')) closeRegion();

    var langBtn = e.target.closest('.lang__btn');
    if (langBtn) { state.lang = langBtn.dataset.lang; applyAll(); return; }

    var tasteBtn = e.target.closest('[data-taste]');
    if (tasteBtn) { toggleTaste(tasteBtn.dataset.taste, tasteBtn); return; }

    var enBtn = e.target.closest('[data-enonly]');
    if (enBtn) {
      state.menuOnly = !state.menuOnly;
      renderSpots(enBtn.closest('.screen'));
      return;
    }

    var chip = e.target.closest('.chip');
    if (chip) {
      var group = chip.closest('.chips');
      var kind = group.dataset.filter;
      state.filter[kind] = chip.dataset.cat;
      applyFilter(chip.closest('.screen'), kind);
      return;
    }

    var go = e.target.closest('[data-go]');
    if (go) { goScreen(go.dataset.go, go); return; }

    var open = e.target.closest('[data-open]');
    if (open) { openMobile(open.dataset.open); return; }

    var walk = e.target.closest('#startWalk');
    if (walk) { toggleWalk(walk); return; }

    var regionBtn = e.target.closest('.region__btn');
    if (regionBtn) {
      e.stopPropagation();
      toggleRegion(regionBtn);
      return;
    }

    var toastBtn = e.target.closest('[data-toast]');
    if (toastBtn) {
      var key = toastBtn.dataset.toast;
      toastIn(toastBtn, T('toast' + key.charAt(0).toUpperCase() + key.slice(1)));
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeRegion();
  });

  document.querySelectorAll('.viewswitch__btn').forEach(function (b) {
    b.addEventListener('click', function () { setView(b.dataset.view); });
  });

  /* ---------------- 시작 ---------------- */
  buildOverview();
  buildRail();
  applyAll();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { document.documentElement.classList.add('fonts-ready'); });
  }
})();
