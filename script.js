let resultText = "";


// =====================
// 정리하기 버튼
// =====================

document.getElementById("runButton")
    .addEventListener("click", function () {

        const fileInput =
            document.getElementById("fileInput");


        if (fileInput.files.length === 0) {
            alert("파일을 선택해주세요.");
            return;
        }


        const file =
            fileInput.files[0];


        const reader =
            new FileReader();


        reader.onload = function (e) {

            let text =
                e.target.result;


            text = cleanText(text);



            const splitFile =
                document.getElementById("splitFile").checked;


            if (splitFile) {

                splitTextFile(text);

            }
            else {

                resultText = text;
                createDownload();

            }


            document.getElementById("status").innerText =
                "삭제 완료!";

        };


        reader.readAsText(file);

    });





// =====================
// 텍스트 정리 함수
// =====================

function cleanText(text) {

    // =====================
    // 숨은 문자 제거
    // =====================

    text = text.replace(
        /[\u200B-\u200D\u2060\uFEFF]/g,
        ""
    );



    // =====================
    // 문구 변경
    // =====================

    const replaceFrom =
        document.getElementById("replaceFrom").value;

    const replaceTo =
        document.getElementById("replaceTo").value;


    if (replaceFrom !== "") {

        text =
            text.replaceAll(
                replaceFrom,
                replaceTo
            );

    }



// =====================
// 직접 입력 문구 삭제
// =====================

const deleteText =
    document.getElementById("deleteText").value;

const deleteWholeLine =
    document.getElementById("deleteWholeLine").checked;


if (deleteText !== "") {

    if (deleteWholeLine) {

        // 문구가 들어있는 줄 전체 삭제
        text =
            text
                .split("\n")
                .filter(line => !line.includes(deleteText))
                .join("\n");

    } else {

        // 문구만 삭제
        text =
            text.replaceAll(
                deleteText,
                ""
            );

    }

}



    // =====================
    // 날짜 삭제
    // =====================

    const deleteDate =
        document.getElementById("deleteDate").checked;

    if (deleteDate) {

        const datePattern =
            /\d{4}년\s\d{1,2}월\s\d{1,2}일\s(오전|오후)\s\d{1,2}:\d{2},?\s/g;


        text =
            text.replace(
                datePattern,
                ""
            );

    }


    // =====================
    // 날짜 삭제 + 시간 유지
    // =====================

    const keepTime =
        document.getElementById("keepTime").checked;

    if (keepTime) {

        const timePattern =
            /\d{4}년\s\d{1,2}월\s\d{1,2}일\s((오전|오후)\s\d{1,2}:\d{2}),?/g;


        text =
            text.replace(
                timePattern,
                "$1"
            );

    }

    // =====================
    // 사진 일괄 변경
    // =====================

// 체크박스(replacePhotoCount)가 체크되어 있는지 확인
const replacePhotoCount =
    document.getElementById("replacePhotoCount").checked;

// 체크 여부 출력
console.log("replacePhotoCount:", replacePhotoCount);

// 체크되어 있을 때만 실행
if (replacePhotoCount) {

    // 기능 시작 로그
    console.log("사진 변환 기능 시작");

    // 긴 해시 형태의 이미지 파일명을 찾는 정규식
    // 예: 9ab38c0...f2.png
    const imagePattern =
        /\b[a-f0-9]{50,}\.(png|jpg|jpeg)\b/i;

    // "<사진 읽지 않음>"이 들어있는 줄을 찾는 정규식
    const photoPattern =
        /^.*<사진 읽지 않음>.*$/;

    // 텍스트를 줄 단위 배열로 분리
    const lines = text.split("\n");

    // 전체 줄 개수 출력
    console.log("총 줄 수:", lines.length);

    // 최종 결과를 저장할 배열
    const result = [];

    // 연속된 사진 개수
    let count = 0;

    // 사진 묶음을 결과에 추가하는 함수
    function flush() {

        // 사진이 하나 이상 모여 있다면
        if (count > 0) {

            // 로그 출력
            console.log(`<사진 ${count}장> 추가`);

            // 결과 배열에 추가
            result.push(`<사진 ${count}장>`);

            // 카운트 초기화
            count = 0;
        }
    }

    // 한 줄씩 검사
    for (const line of lines) {

        // 앞뒤 공백 제거
        const trimmed = line.trim();

        // png/jpg/jpeg 또는 <사진>이 들어있는 줄만 로그 출력
        if (
            trimmed.includes("png") ||
            trimmed.includes("jpg") ||
            trimmed.includes("jpeg") ||
            trimmed.includes("<사진")
        ) {
            console.log("==========");
            console.log("현재 줄:", trimmed);
        }

        // 현재 줄이 이미지 파일명인지 검사
        const isImage = imagePattern.test(trimmed);

        // 현재 줄이 "<사진 읽지 않음>"인지 검사
        const isPhoto = photoPattern.test(trimmed);

        // 이미지 관련 줄이라면 검사 결과 출력
        if (
            trimmed.includes("png") ||
            trimmed.includes("jpg") ||
            trimmed.includes("jpeg") ||
            trimmed.includes("<사진")
        ) {
            console.log("이미지?", isImage);
            console.log("사진?", isPhoto);
        }

        // 이미지이거나 <사진 읽지 않음>이라면
        if (isImage || isPhoto) {

            // 사진 개수 증가
            count++;

            console.log("카운트:", count);

        } else {

            // 일반 텍스트를 만나면
            // 지금까지 모인 사진을 <사진 n장>으로 저장
            flush();

            // 일반 텍스트는 그대로 결과에 추가
            result.push(line);
        }
    }

    // 마지막 줄이 사진으로 끝나는 경우를 처리
    flush();

    // 배열을 다시 문자열로 합침
    text = result.join("\n");

    // 최종 결과 출력
    console.log("=== 최종 결과 ===");
    console.log(text);
}

// 빈 이름 사용자 변경

const replaceEmptyName =
    document.getElementById("replaceEmptyName").checked;


if (replaceEmptyName) {

    const name =
        document.getElementById("emptyName").value;


    // 쉼표 뒤 빈 이름
    text =
        text.replace(
            /,[ \t]*:/g,
            `, ${name} :`
        );


    // 시간 뒤 빈 이름 (오후 11:57  :)
    text =
        text.replace(
            /((오전|오후)\s\d{1,2}:\d{2})[ \t]+:/g,
            `$1 ${name} :`
        );

    // 줄 시작 빈 이름
text =
    text.replace(
        /^[ \t]*:[ \t]*/gm,
        `${name} : `
    );

}


    // =====================
    // 허용된 이름 없는 줄 삭제
    // =====================

    text =
        text
            .split("\n")
            .filter(line =>
                /(초록|레곤|공백| )\s*:/.test(line)
            )
            .join("\n");



    // =====================
    // 빈 줄 제거
    // =====================

    const removeEmpty =
        document.getElementById("removeEmpty").checked;


    if (removeEmpty) {

        text =
            text
                .split("\n")
                .filter(line => line.trim() !== "")
                .join("\n");

    }


    return text;

}




// =====================
// 일반 다운로드
// =====================

function createDownload() {

    const blob =
    new Blob(
        ["\uFEFF", resultText],
        { type:"text/plain;charset=utf-8" }
    );


    const url =
        URL.createObjectURL(blob);


    const a =
        document.createElement("a");


    a.href = url;

    a.download =
        "정리된파일.txt";


    a.click();


    URL.revokeObjectURL(url);

}




// =====================
// 파일 분할
// =====================

function splitTextFile(text) {


    const lines =
        text.split("\n");


    const size =
        Number(
            document.getElementById("splitLines").value
        );


    let files = [];


    for (
        let i = 0;
        i < lines.length;
        i += size
    ) {


        files.push(
            lines
                .slice(i, i + size)
                .join("\n")
        );

    }


    downloadParts(files);

}





// =====================
// ZIP 다운로드
// =====================

function downloadParts(files) {


    const zip =
        new JSZip();


    files.forEach(
        (content, index) => {

            zip.file(
    `정리파일_${index + 1}.txt`,
    "\uFEFF" + content
);

        });


    zip.generateAsync({
        type: "blob"
    })
        .then(function (content) {


            const url =
                URL.createObjectURL(content);


            const a =
                document.createElement("a");


            a.href =
                url;


            a.download =
                "정리파일.zip";


            a.click();


            document.getElementById("status").innerText =
                files.length + "개 파일을 ZIP으로 생성 완료";


        });

}





// =====================
// 테스트 샘플 생성 (앞 1000줄)
// =====================

document.getElementById("makeSampleButton")
    .addEventListener("click", function () {


        const fileInput =
            document.getElementById("fileInput");


        if (fileInput.files.length === 0) {

            alert("먼저 파일을 선택해주세요.");
            return;

        }



        const file =
            fileInput.files[0];


        const reader =
            new FileReader();



        reader.onload = function (e) {


            let text =
                e.target.result;



            // 정리 적용
            text =
                cleanText(text);



            // 앞 1000줄
            const sample =
                text
                    .split("\n")
                    .slice(0, 1000)
                    .join("\n");



            const blob =
                new Blob(
                    [sample],
                    {
                        type: "text/plain"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const a =
                document.createElement("a");


            a.href =
                url;


            a.download =
                "테스트_샘플.txt";


            a.click();


        };


        reader.readAsText(file);


    });
