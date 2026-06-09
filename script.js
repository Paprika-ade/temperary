// 성균관대학교 자연과학캠퍼스 중심 좌표
const campusLat = 37.2947;
const campusLng = 126.9756;

const map = L.map("map").setView([campusLat, campusLng], 17);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
}).addTo(map);

// 쓰레기통 커스텀 아이콘
const trashIcon = L.divIcon({
    className: "",
    html: '<div class="trash-marker"><span>🗑️</span></div>',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

// 현재 위치 커스텀 아이콘
const userIcon = L.divIcon({
    className: "",
    html: '<div class="user-location"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
});

// 임의 쓰레기통 데이터
const bins = [
    {
        name: "제2 과학관",
        lat: 37.2950,
        lng: 126.9758,
        type: "분리수거",
        status: "양호",
        distance: "약 80m"
    },
    {
        name: "제2 과학관",
        lat: 37.2948,
        lng: 126.9748,
        type: "재활용",
        status: "약간 가득 참",
        distance: "약 120m"
    },
    {
        name: "제1공학관 입구",
        lat: 37.2942,
        lng: 126.9763,
        type: "일반쓰레기",
        status: "보통",
        distance: "약 160m"
    },
    {
        name: "제1공학관",
        lat: 37.2939,
        lng: 126.9769,
        type: "분리수거",
        status: "양호",
        distance: "약 230m"
    },
    {
        name: "생명공학관",
        lat: 37.2960,
        lng: 126.9745,
        type: "일반쓰레기",
        status: "보통",
        distance: "약 300m"
    }
];

// 쓰레기통 마커 표시
bins.forEach(bin => {
    L.marker([bin.lat, bin.lng], { icon: trashIcon })
        .addTo(map)
        .bindPopup(`
      <b>${bin.name}</b><br>
      종류: ${bin.type}<br>
      상태: ${bin.status}<br>
      거리: ${bin.distance}
    `);
});

// 가까운 쓰레기통 목록 표시
const binList = document.getElementById("bin-list");

bins.forEach(bin => {
    binList.innerHTML += `
    <div class="bin-item">
      <div class="bin-icon">🗑️</div>
      <div>
        <strong>${bin.name}</strong>
        <p>${bin.type} · ${bin.status} · ${bin.distance}</p>
      </div>
    </div>
  `;
});

// 현재 위치 실시간 표시
let userMarker = null;
let currentLat = null;
let currentLng = null;
let firstLocation = true;

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        function (position) {
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;

            if (!userMarker) {
                userMarker = L.marker([currentLat, currentLng], { icon: userIcon })
                    .addTo(map)
                    .bindPopup("현재 위치");
            } else {
                userMarker.setLatLng([currentLat, currentLng]);
            }

            if (firstLocation) {
                map.setView([currentLat, currentLng], 17);
                firstLocation = false;
            }
        },
        function (error) {
            console.log("위치 정보를 가져올 수 없습니다.", error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 1000
        }
    );
}

function moveToMyLocation() {
    if (currentLat && currentLng) {
        map.flyTo([currentLat, currentLng], 18, {
            animate: true,
            duration: 1
        });
    } else {
        alert("현재 위치를 불러오는 중입니다.");
    }
}

// 탭 전환
function showPage(pageId, button) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });

    button.classList.add("active");

    if (pageId === "map-page") {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
}

// 분리수거 안내 검색
function searchGuide() {
    const input = document.getElementById("guide-input").value.trim();
    const result = document.getElementById("guide-result");

    const guideData = {
        "페트병": "내용물을 비우고 라벨을 제거한 뒤 압축해서 플라스틱류로 배출합니다.",
        "종이컵": "깨끗한 경우 종이류로 배출할 수 있지만, 코팅되었거나 오염된 경우 일반쓰레기로 배출합니다.",
        "배달용기": "음식물을 제거하고 세척한 뒤 배출합니다. 기름기가 심하면 일반쓰레기로 배출합니다.",
        "캔": "내용물을 비우고 가능한 압축한 뒤 캔류로 배출합니다.",
        "유리병": "내용물을 비우고 병뚜껑을 분리한 뒤 유리류로 배출합니다."
    };

    if (guideData[input]) {
        result.innerHTML = `
      <h3>${input}</h3>
      <p>${guideData[input]}</p>
    `;
    } else {
        result.innerHTML = `
      <h3>검색 결과 없음</h3>
      <p>현재는 페트병, 종이컵, 배달용기, 캔, 유리병을 검색할 수 있습니다.</p>
    `;
    }
}
