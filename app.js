/* SceneRoad 프로토타입 동작 */
(function () {
  'use strict';

  /* ---------------- 화면 정의 ---------------- */
  var SCREENS = [
    { id: 'home', label: '여행 홈' },
    { id: 'crowd', label: '방문 시간과 혼잡도' },
    { id: 'course', label: '도보 코스' },
    { id: 'spots', label: '주변 가게' }
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
      note: { kr: '감고당길 안쪽에 자리한 한식당', en: 'A modern Korean restaurant tucked off Gamgodang-gil', jp: 'カムゴダンギルの路地裏にある韓国料理店' },
      scene: { kr: '〈사내맞선〉 5화 저녁 식사 장면', en: 'Dinner scene in episode 5 of Business Proposal', jp: '『社内お見合い』第5話の夕食シーン' },
      tastes: ['food', 'friends', 'drama']
    },
    {
      id: 'dotblanket', cat: 'cafe', rating: 4.8, count: 486, dist: 320, walk: 5, menuEn: true,
      img: 'assets/spot-dotblanket.jpg', alt: '도트블랭킷 브런치 팬케이크',
      name: { kr: '도트블랭킷', en: 'Dot Blanket', jp: 'ドットブランケット' },
      note: { kr: '브런치와 디저트를 즐기기 좋은 카페', en: 'A café for brunch and dessert', jp: 'ブランチとデザートが楽しめるカフェ' },
      scene: { kr: '〈사내맞선〉 2화 카페 장면', en: 'Café scene in episode 2 of Business Proposal', jp: '『社内お見合い』第2話のカフェシーン' },
      tastes: ['friends', 'solo', 'drama']
    },
    {
      id: 'tea', cat: 'tea', rating: 4.6, count: 152, dist: 380, walk: 6, menuEn: true,
      img: 'assets/spot-teatherapy.jpg', alt: '티테라피 행랑점 한옥 골목',
      name: { kr: '티테라피 행랑점', en: 'Tea Therapy Haengnang', jp: 'ティーテラピー 行廊店' },
      note: { kr: '한옥에서 차 한 잔 마시며 쉬어 가기 좋은 곳', en: 'A quiet hanok teahouse for a break', jp: '韓屋でお茶を飲みながらひと休みできる店' },
      scene: { kr: '드라마 배경이 된 한옥 찻집', en: 'Hanok tea house seen in dramas', jp: 'ドラマの背景になった韓屋茶屋' },
      tastes: ['hanok', 'solo', 'drama']
    },
    {
      id: 'film', cat: 'shop', rating: 4.9, count: 64, dist: 210, walk: 3, menuEn: false,
      img: 'assets/spot-film.jpg', alt: '안국 필름상회 필름 카메라 진열',
      name: { kr: '안국 필름상회', en: 'Anguk Film Club', jp: 'アングク フィルム商會' },
      note: { kr: '필름 카메라를 빌리고 필름을 현상할 수 있는 곳', en: 'Rent a film camera or get your film developed', jp: 'フィルムカメラのレンタルとフィルム現像ができる店' },
      scene: { kr: '골목 풍경을 필름에 담기', en: 'Capture the neighborhood on film', jp: '路地の風景をフィルムに残してみよう' },
      tastes: ['drama', 'solo', 'friends']
    },
    {
      id: 'mandu', cat: 'korean', rating: 4.7, count: 391, dist: 150, walk: 2, menuEn: false,
      img: 'assets/spot-mandu.jpg', alt: '골목 왕만두 김 오르는 한 접시',
      name: { kr: '골목 왕만두', en: 'Golmok Wangmandu', jp: 'コルモク ワンマンドゥ' },
      note: { kr: '김이 모락모락 나는 왕만두를 파는 골목 가게', en: 'A tucked-away shop serving steaming jumbo dumplings', jp: '湯気の立つ大きなマンドゥが食べられる路地の店' },
      scene: { kr: '산책 중 출출할 때 들르기 좋아요', en: 'A quick bite along the walk', jp: '散歩の途中、小腹が空いたら立ち寄ってみよう' },
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
      all: '보기', seeAll: '전체 보기', nearby: '근처 추천 장소', tasteTitle: '여행 취향',
      tasteHint: '하나만 골라도 코스가 바뀝니다', tasteCount: '{n}개 선택', tasteNone: '골라 보세요',
      menuOnly: '영어 메뉴만', listHead: '촬영지에서 걸어서 10분 이내', spotsTitle: '안국 골목 가게',
      mapChip: '안국 (종로구)', emptyCourse: '이 코스에 해당하는 가게가 없어요.',
      emptySpots: '조건에 맞는 가게가 없어요. 다른 조건으로 찾아보세요.',
      spotNote: '영업시간과 영어 메뉴는 방문 전에 가게에 확인해 주세요.',
      courseNote: '걸리는 시간은 걸음 속도에 따라 달라질 수 있어요.',
      sumDist: '총 거리', sumWalk: '도보 시간', sumEn: '영어 메뉴', unitMin: '분', unitPlace: '곳',
      sumBest: '{time} 방문 추천',
      startWalk: '씬로와 코스 미리 보기', walking: '코스 미리 보는 중 {n}/3', stopWalk: '미리 보기 멈추기', replayWalk: '코스 다시 보기',
      guideDefault: '어떤 여행이 좋아? 취향을 고르면 함께 걸을 코스를 추천해 줄게.',
      match: '추천 이유', walkUnit: '도보 {n}분',
      summary: '{spots}곳, 도보 {min}분, 영어 메뉴 {en}곳',
      summaryShort: '{spots}곳, 도보 {min}분, 영어 메뉴 {en}곳',
      crowdTitle: '방문 시간과 혼잡도', regionAnguk: '안국', regionBukchon: '북촌',
      regionIkseon: '익선동', regionSeochon: '서촌', soon: '준비 중',
      crowdNowLabel: '현재 혼잡도', crowdNowValue: '한산',
      crowdNowNote: '오후 2시부터 4시까지는 붐비는 편이에요.',
      crowdBestLabel: '추천 방문 시간', crowdBestNote: '여유롭게 둘러보고 사진 찍기 좋아요.',
      crowdBestTag1: '짧은 대기', crowdBestTag2: '좋은 채광',
      crowdChartTitle: '시간대별 방문객', crowdPeak: '오후 3시 가장 붐빔',
      crowdChartTip: '오후 3시가 가장 붐벼요. 조금 여유롭게 보려면 오전 11시나 오후 5시쯤 가 보세요.',
      crowdTipsTitle: '가기 전에 알아두세요',
      crowdTip1: '조용히 걷고 싶다면 오전에 골목을 둘러보세요.',
      crowdTip2: '주변 가게에서 영어 메뉴가 있는 곳을 골라 볼 수 있어요.',
      crowdTip3: '촬영지에서 온미관 안국까지 걸어서 4분이에요.',
      crowdNote: '2026년 11월 서울시 유동인구와 카드 매출 기준',
      crowdBestDefault: '오전 11시',
      crowdGuideTitleDefault: '오전 11시나 오후 5시쯤 가 봐',
      crowdGuideTextDefault: '여행 취향을 알려 주면 그 코스를 둘러보기 좋은 시간도 골라 줄게.',
      qDrama: '드라마', qRoute: '도보 코스', qSpots: '주변 가게', qMore: '더 보기',
      tabHome: '홈', tabExplore: '탐색', tabMap: '지도', tabSaved: '저장', tabRoute: '코스',
      tabSpots: '주변 가게', tabReviews: '리뷰', tabCrowd: '혼잡도',
      catAll: '전체', catKorean: '한식', catCafe: '카페', catTea: '전통찻집', catShop: '상점',
      catName: { korean: '한식당', cafe: '브런치 카페', tea: '한옥 찻집', shop: '필름 상점' },
      toastDrama: '드라마 목록은 준비 중이에요.',
      toastMore: '더 보기 메뉴는 준비 중이에요.',
      toastSaved: '코스 저장 기능은 준비 중이에요.',
      toastReviews: '리뷰 기능은 준비 중이에요.',
      toastLimit: '취향은 3개까지 고를 수 있어요.',
      toastWalk: '씬로와 첫 번째 장소로 출발! {name}까지 걸어서 {n}분이에요.',
      toastWalkOff: '코스 미리 보기를 멈췄어요.',
      taste: {
        drama: {
          km: 1.4, label: '드라마 속 장면', badge: 'SBS 드라마', title: '〈사내맞선〉 속 그 골목', sub: '안국동 감고당길에서 시작하는 1.4km 산책',
          guide: '〈사내맞선〉 3화 마지막 장면 기억나? 그 골목으로 같이 가 보자.',
          course: '〈사내맞선〉 따라 걷는 안국', lead: '드라마 속 골목과 근처에 들를 곳을 골랐어.',
          best: '오전 11시', crowdTitle: '드라마 속 골목은 오전 11시쯤 가 봐', crowd: '오후 3시가 붐비는 편이라 오전에 가면 사진도 좀 더 여유롭게 찍을 수 있어.'
        },
        food: {
          km: 1.1, label: '골목 맛집', badge: '골목 맛집', title: '감고당길에서 맛보는 골목 한 끼', sub: '안국역 3번 출구에서 걸어서 2분',
          guide: '출출하면 왕만두부터 먹으러 갈까? 점심시간이 지나면 줄이 짧아지는 편이야.',
          course: '감고당길 맛집 산책', lead: '만두집에서 한식당, 브런치 카페까지 이어지는 길이야.',
          best: '오후 2시', crowdTitle: '만두집은 점심시간이 지나고 가 봐', crowd: '정오부터 오후 1시 반까지는 대기가 생길 수 있어. 오후 2시쯤이 좀 더 여유로워.'
        },
        hanok: {
          km: 1.1, label: '한옥 카페', badge: '한옥 카페', title: '한옥 찻집에서 쉬어 가는 오후', sub: '안국 골목을 따라 걷는 1.1km 산책',
          guide: '골목을 천천히 걷다가 한옥에서 차 한 잔 어때? 오후 두 시쯤 들러 봐.',
          course: '한옥 찻집에 들르는 산책', lead: '차 한 잔 마시고 골목을 천천히 둘러보는 길이야.',
          best: '오후 2시', crowdTitle: '오후 두 시쯤 한옥 찻집에 들러 봐', crowd: '네 시쯤에는 자리가 차는 편이야. 창가에 앉고 싶다면 조금 일찍 들러 봐.'
        },
        solo: {
          km: 1.3, label: '혼자 걷기', badge: '혼자 여행', title: '내 속도로 걷는 안국 골목', sub: '조용한 오전에 걷기 좋은 1.3km 산책',
          guide: '오늘은 서두르지 말고 걷자. 혼자 가도 편하게 들를 만한 곳을 골랐어.',
          course: '혼자 걷는 안국 골목', lead: '걷다가 잠깐 쉬어 가기 좋은 곳을 넣었어.',
          best: '오전 10시', crowdTitle: '혼자 걷기엔 오전 열 시가 좋아', crowd: '열한 시 전엔 골목이 비교적 조용해. 천천히 걷고 사진도 몇 장 남겨 봐.'
        },
        friends: {
          km: 1.5, label: '친구와 함께', badge: '친구와 함께', title: '친구와 남기는 안국의 한 장면', sub: '필름 카메라 대여점에 들르는 1.5km 코스',
          guide: '친구랑 같은 장면을 따라 찍어 볼래? 사진 남기기 좋은 곳을 골랐어.',
          course: '친구와 걷는 안국 사진 코스', lead: '밥 먹고 커피 한 잔 한 뒤, 필름 카메라를 빌려 봐.',
          best: '오후 5시', crowdTitle: '친구와 사진 찍으러 오후 다섯 시쯤 가 봐', crowd: '오후 다섯 시쯤엔 인파가 줄고 골목에 노을이 들어와.'
        }
      },
      heroDefault: { badge: 'SBS 드라마', title: '〈사내맞선〉 속 그 골목', sub: '안국동 감고당길에서 시작하는 1.4km 산책' }
    },

    en: {
      all: 'View', seeAll: 'See all', nearby: 'Recommended nearby', tasteTitle: 'What do you enjoy?',
      tasteHint: 'Pick one and the course changes', tasteCount: '{n} picked', tasteNone: 'Pick one',
      menuOnly: 'English menus only', listHead: 'Within 10 minutes on foot', spotsTitle: 'Local spots near Anguk',
      mapChip: 'Anguk, Jongno-gu', emptyCourse: 'No places on this route match your filter.',
      emptySpots: 'No places match. Try changing your filters.',
      spotNote: 'Opening hours and English menus can change on the day of your visit.',
      courseNote: 'Walking times can shift a little on the day of your visit.',
      sumDist: 'Distance', sumWalk: 'Walk time', sumEn: 'EN menus', unitMin: 'min', unitPlace: 'spots',
      sumBest: 'Best around {time}',
      startWalk: 'Preview the walk', walking: 'Route preview, stop {n} of 3', stopWalk: 'Stop route preview', replayWalk: 'Replay route',
      guideDefault: 'What sounds fun? Pick an interest and I’ll find a walk for you.',
      match: 'Why this pick', walkUnit: '{n} min walk',
      summary: '{spots} stops, {min} min on foot, {en} with English menu',
      summaryShort: '{spots} stops, {min} min, {en} EN menus',
      crowdTitle: 'Best time & crowds', regionAnguk: 'Anguk area', regionBukchon: 'Bukchon area',
      regionIkseon: 'Ikseon area', regionSeochon: 'Seochon area', soon: 'Soon',
      crowdNowLabel: 'Crowds now', crowdNowValue: 'Quiet',
      crowdNowNote: 'It tends to get busier between 2 and 4 PM.',
      crowdBestLabel: 'Best time', crowdBestNote: 'More time to look around and take photos.',
      crowdBestTag1: 'Short wait', crowdBestTag2: 'Good light',
      crowdChartTitle: 'Visitors by hour', crowdPeak: '3 PM peak',
      crowdChartTip: '3 PM is the busiest. Try around 11 AM or 5 PM for a quieter visit.',
      crowdTipsTitle: 'Visitor tips',
      crowdTip1: 'For a quieter walk, explore the alleys in the morning.',
      crowdTip2: 'Filter nearby places to see which ones have an English menu.',
      crowdTip3: 'Onmigwan Anguk is a four-minute walk from the filming location.',
      crowdNote: 'Seoul foot traffic and card data, Nov 2026',
      crowdBestDefault: '11 AM',
      crowdGuideTitleDefault: 'Try around 11 AM or 5 PM',
      crowdGuideTextDefault: 'Tell me what you enjoy, and I’ll suggest when to go.',
      qDrama: 'Drama', qRoute: 'Walk route', qSpots: 'Local spots', qMore: 'More',
      tabHome: 'Home', tabExplore: 'Explore', tabMap: 'Map', tabSaved: 'Saved', tabRoute: 'Route',
      tabSpots: 'Spots', tabReviews: 'Reviews', tabCrowd: 'Crowds',
      catAll: 'All', catKorean: 'Korean', catCafe: 'Cafe', catTea: 'Tea house', catShop: 'Shop',
      catName: { korean: 'Korean', cafe: 'Brunch cafe', tea: 'Hanok tea', shop: 'Film shop' },
      toastDrama: 'Drama listings are coming soon.',
      toastMore: 'More options are coming soon.',
      toastSaved: 'Saving routes is coming soon.',
      toastReviews: 'Reviews are coming soon.',
      toastLimit: 'Choose up to three interests.',
      toastWalk: 'Our first stop is {name}, a {n} min walk.',
      toastWalkOff: 'Route preview stopped.',
      taste: {
        drama: { km: 1.4, label: 'K-drama romance', badge: 'SBS drama', title: 'Walk into Business Proposal', sub: 'Gamgodang-gil, Anguk-dong, Seoul, 1.4 km on foot', guide: 'Remember the alley from the end of episode 3? Let’s go find it.', course: 'Business Proposal walk', lead: 'Follow the drama through Anguk and stop at a few nearby favorites.', best: '11 AM', crowdTitle: 'Quiet before the tour groups', crowd: 'It gets busier around 3 PM. Go in the morning for more space to take photos.' },
        food: { km: 1.1, label: 'Alley food', badge: 'Local food', title: 'Gamgodang-gil food alley walk', sub: '2 min from Anguk Station exit 3', guide: 'Hungry? Let’s start with dumplings. The line tends to ease after lunch.', course: 'Gamgodang-gil food alley course', lead: 'An order that works when you are hungry.', best: '2 PM', crowdTitle: 'Try the dumpling shop around 2 PM', crowd: 'There may be a wait from noon to 1:30 PM. Around 2 PM is usually quieter.' },
        hanok: { km: 1.1, label: 'Hanok cafe', badge: 'Hanok cafe', title: 'A slow afternoon in a hanok cafe', sub: 'A 1.1 km stroll through the Anguk alleys', guide: 'How about tea in a hanok? Try stopping by around 2 PM.', course: 'Hanok cafe slow afternoon', lead: 'I left time to sit and rest.', best: '2 PM', crowdTitle: 'Stop by the hanok teahouse around 2 PM', crowd: 'Seats tend to fill up by 4 PM. Go a little earlier if you’d like a window seat.' },
        solo: { km: 1.3, label: 'Solo walk', badge: 'Solo trip', title: 'Quiet Anguk alleys for a solo walk', sub: 'Best in the quiet morning, 1.3 km on foot', guide: 'Walk at your own pace. I picked a few places where you can take a break on your own.', course: 'Solo walk in Anguk alleys', lead: 'I kept you out of the busy hours.', best: '10 AM', crowdTitle: '10 AM is the quietest for a solo walk', crowd: 'Before 11 AM the alleys are nearly empty, so your photos come out without a crowd.' },
        friends: { km: 1.5, label: 'With friends', badge: 'With friends', title: 'A route made for photos with friends', sub: 'A 1.5 km walk with a stop at a film camera shop', guide: 'Want to recreate a favorite scene with friends? I picked a few places for photos.', course: 'Photo walk with friends', lead: 'Mostly places worth a photo.', best: '5 PM', crowdTitle: 'Golden hour at 5 PM is best for photos', crowd: 'The queue is long at 3 PM. At 5 PM the alley turns golden and the light is soft.' }
      },
      heroDefault: { badge: 'SBS drama', title: 'Walk into Business Proposal', sub: 'Gamgodang-gil, Anguk-dong, Seoul, 1.4 km on foot' }
    },

    jp: {
      all: '見る', seeAll: 'すべて見る', nearby: '好みに合うスポット', tasteTitle: '旅の好み',
      tasteHint: 'ひとつ選ぶだけでコースが変わります', tasteCount: '{n}件選択', tasteNone: '選んでみて',
      menuOnly: '英語メニュー', listHead: 'ロケ地から徒歩10分以内', spotsTitle: '安国の路地にあるお店',
      mapChip: '安国（鍾路区）', emptyCourse: 'この条件に合うお店はコース内にありません。',
      emptySpots: '条件に合うお店がありません。条件を変えて探してみてください。',
      spotNote: '営業時間と英語メニューは当日の店舗の状況で変わる場合があります。',
      courseNote: '徒歩時間は当日の状況で少し変わることがあります。',
      sumDist: '総距離', sumWalk: '徒歩時間', sumEn: '英語メニュー', unitMin: '分', unitPlace: 'か所',
      sumBest: '{time}がおすすめ',
      startWalk: 'コースを下見する', walking: '下見中 {n}/3', stopWalk: '下見を中止', replayWalk: 'コースをもう一度見る',
      guideDefault: 'どんな旅が好き？好みに合わせて一緒に歩くコースを選ぶよ。',
      match: 'おすすめ理由', walkUnit: '徒歩{n}分',
      summary: '{spots}か所、徒歩{min}分、英語メニュー{en}か所',
      summaryShort: '{spots}か所 徒歩{min}分 英語{en}店',
      crowdTitle: '訪問時間と混雑度', regionAnguk: '安国エリア', regionBukchon: '北村エリア',
      regionIkseon: '益善洞エリア', regionSeochon: '西村エリア', soon: '準備中',
      crowdNowLabel: '今の混雑度', crowdNowValue: '空いてる',
      crowdNowNote: '午後2時から4時ごろは混みやすいです。',
      crowdBestLabel: 'おすすめの訪問時間', crowdBestNote: 'ゆっくり歩いて写真を撮りやすい時間です。',
      crowdBestTag1: '待ち短い', crowdBestTag2: '光がいい',
      crowdChartTitle: '時間帯別の来訪者数', crowdPeak: '15時ピーク',
      crowdChartTip: '午後3時が一番混みます。ゆっくり見て回るなら、午前11時か午後5時ごろがおすすめです。',
      crowdTipsTitle: '訪問のヒント',
      crowdTip1: '静かに散歩したいなら、午前中に路地を歩いてみてください。',
      crowdTip2: '周辺のお店は英語メニューの有無で絞り込めます。',
      crowdTip3: 'ロケ地からオンミグァン安国までは徒歩4分です。',
      crowdNote: 'ソウル市の流動人口とカード売上、2026年11月',
      crowdBestDefault: '午前11時',
      crowdGuideTitleDefault: '午前11時か午後5時が空いています',
      crowdGuideTextDefault: '旅の好みを教えてくれたら、コースを回りやすい時間も選ぶよ。',
      qDrama: 'ドラマ', qRoute: '徒歩ルート', qSpots: '周辺のお店', qMore: 'その他',
      tabHome: 'ホーム', tabExplore: '探す', tabMap: '地図', tabSaved: '保存', tabRoute: 'ルート',
      tabSpots: 'スポット', tabReviews: 'レビュー', tabCrowd: '混雑度',
      catAll: 'すべて', catKorean: '韓国料理', catCafe: 'カフェ', catTea: '伝統茶屋', catShop: 'お店',
      catName: { korean: '韓国料理', cafe: 'ブランチカフェ', tea: '韓屋茶屋', shop: 'フィルム店' },
      toastDrama: 'ドラマ一覧は準備中です。',
      toastMore: 'もっと見るメニューは準備中です。',
      toastSaved: 'コースの保存機能は準備中です。',
      toastReviews: 'レビュー機能は準備中です。',
      toastLimit: '好みは3つまで選べます。',
      toastWalk: '最初に向かうのは{name}。歩いて{n}分です。',
      toastWalkOff: 'コースの下見を中止しました。',
      taste: {
        drama: { km: 1.4, label: 'Kドラマ ロマンス', badge: 'SBSドラマ', title: '『社内お見合い』のあの路地を歩く', sub: 'ソウル 安国洞 カムゴダンギル、徒歩1.4km', guide: '第3話のラストに出てきた路地、覚えてる？一緒に行ってみよう。', course: '『社内お見合い』をたどる安国散歩', lead: 'ドラマに出てきた路地と、近くの立ち寄り先を選んだよ。', best: '午前11時', crowdTitle: '社内お見合いの路地は11時がすいています', crowd: '午後3時は混みやすいから、写真をゆっくり撮るなら午前中に行ってみて。' },
        food: { km: 1.1, label: '路地グルメ', badge: '地元グルメ', title: 'カムゴダンギル 路地グルメ散歩', sub: '安国駅3番出口から徒歩2分', guide: 'おなかが空いたなら、まずはマンドゥを食べに行こう。お昼どきを過ぎると列が短くなるよ。', course: 'カムゴダンギル グルメ散歩', lead: 'お腹が空いた時にいい順番だよ。', best: '午後2時', crowdTitle: 'マンドゥ屋は2時を過ぎると列が短くなります', crowd: '正午から午後1時半ごろは待つこともあるよ。午後2時ごろが比較的空いているよ。' },
        hanok: { km: 1.1, label: '韓屋カフェ', badge: '韓屋カフェ', title: '韓屋カフェでゆっくり午後', sub: '安国の路地を歩く1.1kmの散歩', guide: '韓屋でお茶を一杯どう？午後2時ごろに寄ってみて。', course: '韓屋カフェ ゆっくり午後', lead: '座って休む時間も入れてあるよ。', best: '午後2時', crowdTitle: '韓屋茶屋は2時に窓際が空きます', crowd: '午後4時ごろは席が埋まりやすいよ。窓際がよければ少し早めに行ってみて。' },
        solo: { km: 1.3, label: 'ひとり歩き', badge: 'ひとり旅', title: 'ひとり歩きにいい安国の路地', sub: '静かな午前がおすすめ、徒歩1.3km', guide: '人が少ない道だけを選んだよ。ひとりで歩くのにいい順番。', course: 'ひとり安国路地散歩', lead: '混む時間は避けて組んだよ。', best: '午前10時', crowdTitle: 'ひとり歩きは10時が一番静かです', crowd: '11時前の路地は人が少なく、写真も人を入れずに撮れます。' },
        friends: { km: 1.5, label: '友達と一緒', badge: '友達と一緒', title: '友達と写真を撮るコース', sub: 'フィルムカメラのレンタルも、徒歩1.5km', guide: '友達と好きなシーンを再現してみない？写真を撮りやすい場所を選んだよ。', course: '友達と写真散歩', lead: '写真を残したい場所中心だよ。', best: '午後5時', crowdTitle: '写真は5時の夕暮れが一番きれいです', crowd: '15時は列が長いです。17時なら路地が夕焼け色になります。' }
      },
      heroDefault: { badge: 'SBSドラマ', title: '『社内お見合い』のあの路地を歩く', sub: 'ソウル 安国洞 カムゴダンギル、徒歩1.4km' }
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
    var lead = t ? tasteData(t).lead : tasteData('drama').lead;
    screen.querySelector('[data-guide="course"]').textContent = lead;

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

  function updateCourseSummary(screen) {
    var card = screen.querySelector('[data-course-sum]');
    if (!card) return;
    var t = primaryTaste() || 'drama';
    var all = courseSpots();
    var vis = all.filter(function (s) { return state.filter.course === 'all' || s.cat === state.filter.course; });
    var allMin = all.reduce(function (n, x) { return n + x.walk; }, 0);
    var min = vis.reduce(function (n, x) { return n + x.walk; }, 0);
    var km = tasteData(t).km || 1.4;
    if (allMin > 0) km = Math.round(km * (min / allMin) * 10) / 10;
    card.hidden = vis.length === 0;
    card.querySelector('[data-sum="dist"]').textContent = km.toFixed(1);
    card.querySelector('[data-sum="min"]').textContent = min;
    card.querySelector('[data-sum="en"]').textContent = vis.filter(function (s) { return s.menuEn; }).length;
    card.querySelector('[data-sum="best"]').textContent = fmt(T('sumBest'), { time: tasteData(t).best });
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
      cta.setAttribute('aria-label', active ? text + ', ' + T('stopWalk') : text);
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

  function renderCrowd(screen) {
    var t = primaryTaste();
    var data = t ? tasteData(t) : {
      best: T('crowdBestDefault'),
      crowdTitle: T('crowdGuideTitleDefault'),
      crowd: T('crowdGuideTextDefault')
    };
    var bestEl = screen.querySelector('[data-crowd="best"]');
    var titleEl = screen.querySelector('[data-crowd="title"]');
    var textEl = screen.querySelector('[data-crowd="text"]');
    if (bestEl) bestEl.textContent = data.best;
    if (titleEl) titleEl.textContent = data.crowdTitle;
    if (textEl) textEl.textContent = data.crowd;
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
    if (kind === 'course') updateCourseSummary(screen);
  }

  function renderScreen(screen) {
    var id = screen.dataset.screen;
    if (id === 'home') renderHome(screen);
    else if (id === 'course') renderCourse(screen);
    else if (id === 'spots') renderSpots(screen);
    else if (id === 'crowd') renderCrowd(screen);
  }

  function applyTextIn(root) {
    root.querySelectorAll('[data-t]').forEach(function (el) {
      var v = T(el.dataset.t);
      if (v != null) el.textContent = v;
    });
    root.querySelectorAll('.lang__btn').forEach(function (b) {
      var on = b.dataset.lang === state.lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function applyAll() {
    document.documentElement.lang = state.lang === 'jp' ? 'ja' : (state.lang === 'en' ? 'en' : 'ko');
    applyTextIn(document);
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
    applyTextIn(screen);
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
