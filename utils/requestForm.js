module.exports = {
    authRq: {
      '/auth/token/create': {
        type: 'kakao',
        account: 'llgs901@naver.com',
        name: '이기섭'
      },
      '/auth/sign/in': {
        type: 'kakao',
        account: 'llgs901@naver.com',
        name: '이기섭'
      },
    },
    accountRq: {
      '/account/update': {
        name: '이기섭',
        notification: 1,
        shareFlag: 1,
        registrationKey: 'registration_key', // 푸시 사용자 토큰
        deviceType: 'android' // android or ios 소문자
      }
    },
    diaryRq: {
      '/diary/write': {
        	content: "일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & 일기입니다 팁탭 일기에요 & ",
        	location: "서울시 금천구 가산동 533-22",
        	latitude: "36.806702",
        	longitude: "126.979874"
      },
      '/diary/update': {
        data: 'string'
      },
      '/diary/delete': {
        data: 'string'
      },
    }
}
