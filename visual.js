var table;

var grid = [];

function init(){
    table = document.createElement("table");

    document.body.appendChild(table);

    for(let y = 0; y < 9; y++){
        let tmpTr = document.createElement("tr");
        let tmpGrid = [];
        for(let x = 0; x < 9; x++){
            let tmpTd = document.createElement("td");
            let tmpSelect = document.createElement("input");
            tmpSelect.type = "text";
            tmpSelect.maxLength = 1;
            tmpSelect.setAttribute("onkeypress","return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 49 && event.charCode <= 57))")
            tmpSelect.setAttribute("onclick","this.focus();let length = this.value.length;this.setSelectionRange(length, length);")
            tmpSelect.setAttribute("onchange","updateChanged("+y+","+x+")");

            tmpGrid.push({td:tmpTd,select:tmpSelect});
            tmpTd.appendChild(tmpSelect)
            tmpTr.appendChild(tmpTd);

        }
        grid.push(tmpGrid)
        table.appendChild(tmpTr);
    }
}

function updateTable(){
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            if(grid[y][x].value !== undefined && grid[y][x].value !== 0){
                grid[y][x].select.value = grid[y][x].value;
            }else{
                grid[y][x].select.value = "";
            };
        };
    };
};

function updateChanged(x,y){
    if(grid[x][y].select.value !== ""){
        if(JSON.parse(grid[x][y].select.value) < 1 || JSON.parse(grid[x][y].select.value) > 9){
            grid[x][y].select.value = "";
        };
        grid[x][y].value = JSON.parse(grid[x][y].select.value);
    }else{
        grid[x][y].value = 0;
    }
    
};

init();


function setTestValues(){
    let tmpGrid = [
        [
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
                "value": 1
            },
            {
                "value": 9
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
    
                "value": 3
            }
        ],
        [
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
    
                "value": 8
            },
            {
                "value": 0
            },
            {
    
                "value": 1
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
    
                "value": 5
            },
            {
                "value": 0
            }
        ],
        [
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
    
                "value": 6
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
    
                "value": 4
            }
        ],
        [
            {
    
                "value": 8
            },
            {
                "value": 0
            },
            {
    
                "value": 6
            },
            {
    
                "value": 2
            },
            {
    
                "value": 5
            },
            {
    
                "value": 7
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
    
                "value": 1
            }
        ],
        [
            {
    
                "value": 3
            },
            {
                "value": 0
            },
            {
    
                "value": 7
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
    
                "value": 8
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
                "value": 0

            }
        ],
        [
            {
                "value": 0
            },
            {
    
                "value": 2
            },
            {
                "value": 0
            },
            {
    
                "value": 1
            },
            {
                "value": 0
            },
            {
    
                "value": 3
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
    
                "value": 9
            }
        ],
        [
            {
    
                "value": 2
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
    
                "value": 6
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
    
                "value": 3
            },
            {
    
                "value": 5
            }
        ],
        [
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
    
                "value": 3
            },
            {
    
                "value": 8
            },
            {
    
                "value": 2
            },
            {
                "value": 0
            },
            {
    
                "value": 4
            },
            {
                "value": 0
            },
            {
    
                "value": 6
            }
        ],
        [
            {
                "value": 0
            },
            {
    
                "value": 7
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
    
                "value": 3
            },
            {
    
                "value": 4
            },
            {
                "value": 0
            },
            {
                "value": 0
            },
            {
                "value": 0
            }
        ]
    ];
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            
            grid[y][x].value = tmpGrid[y][x].value;

        };
    };
    updateTable();
};

function moveCursorToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}