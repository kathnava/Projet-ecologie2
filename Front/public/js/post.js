

          function displayTimeInfos(data){
            const d = new Date();
            let month = d.toLocaleDateString();
            let time = d.toLocaleTimeString();
            document.querySelector("#month").innerHTML = month;
            document.querySelector("#time").innerHTML = time;
        }
        const d = new Date();
        document.getElementById("d").innerHTML = d;

        function clickCounter() {
          let result = 0;
          if (typeof (Storage) !== "undefined") {
            if (localStorage.clickcount) {
              localStorage.clickcount = Number(localStorage.clickcount) + 1;
            } else {
              localStorage.clickcount = 1;
            }
            document.getElementById("result").innerHTML = localStorage.clickcount;
          }
        }
        function discounter() {
          let result1 = 0;
          if (typeof (Storage) !== "undefined") {
            if (localStorage.clickcount1) {
              localStorage.clickcount1 = Number(localStorage.clickcount1) + 1;
            } else {
              localStorage.clickcount1 = 1;
            }
            document.getElementById("result1").innerHTML = localStorage.clickcount1;
          }
          if (result1 < 0) {
            result1 = 0
          }
        }
        main()
        console.log('helle')