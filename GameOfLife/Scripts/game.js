
$(function () {
    var generation = 0;
    var myTimer = null;
    var numRows = 201;
    var numCols = 201;
    var size = 4;

    // get/set canvas information
    var canvas = document.getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');
    canvas.width = size * numRows;
    canvas.height = size * numCols;

    var currentGen = new Array(numCols);
    for (var y = 0; y < numCols; ++y) {
        currentGen[y] = new Array(numRows);
    }


    function fill(s, x, y) {
        ctx.fillStyle = s;
        ctx.fillRect(x * size, y * size, size, size);
    }

    function getNextGen() {
        var nextGen = currentGen;
        for (i = 0; i < numRows; i++) {
            for (j = 0; j < numCols; j++) {
                nextGen[i][j] = !nextGen[i][j];
            }
        }
        return nextGen;
    }

    function generateNextGen() {
        $('#curGen').text("Generation: " + generation++);
        var numLiving = 0;
        //  var gen = currentGen;

        //for (i = 0; i < numCols; i++) {
        //    for (j = 0; j < numRows; j++) {
        //        if (gen[i][j])
        //            fill('black', i, j);
        //        else
        //            fill('gray', i, j);
        //    }
        //}
        var nextGen = new Array(numCols);
        for (var y = 0; y < numCols; ++y) {
            nextGen[y] = new Array(numRows);
        }

        for (var row = 0; row < numRows; row++) {
            for (var col = 0; col < numCols; col++) {
                var iLive = amIAlive(row, col);
                if (iLive) numLiving++;
                nextGen[row][col] = iLive;
            }
        }

        currentGen = nextGen;
        drawGeneration();
        if (numLiving == 0) {
            clearInterval(myTimer);
            myTimer = null;
            $('#startButton').text('Start').button("refresh");
        }

    }

    function drawGeneration() {
        for (var row = 0; row < numRows; row++) {
            for (var col = 0; col < numCols; col++) {
                if (currentGen[col][row]) {
                    fill('black', row, col);
                } else {
                    fill('lightgray', row, col);
                }
            }
        }
    }

    function amIAlive(row, column) {
        var neighborCount = 0;
        var isAlive = currentGen[row][column];

        // Check North
        if (row > 0) {
            if (currentGen[row - 1][column]) neighborCount++;
        }

        // Check North East
        if ((row > 0) && (column > 0)) {
            if (currentGen[row - 1][column - 1]) neighborCount++;
        }

        // Check East
        if (column < numCols) {
            if (currentGen[row][column + 1]) neighborCount++;
        }

        // Check South East
        if ((row < numRows - 1) && (column < numCols)) {
            if (currentGen[row + 1][column + 1]) neighborCount++;
        }

        // Check South
        if (row < numRows - 1) {
            if (currentGen[row + 1][column]) neighborCount++;
        }

        // Check South West
        if ((row < numRows - 1) && (column > 0)) {
            if (currentGen[row + 1][column - 1]) neighborCount++;
        }

        // Check West
        if (column > 0) {
            if (currentGen[row][column - 1]) neighborCount++;
        }

        // Check North West
        if ((row > 0) && (column < numCols)) {
            if (currentGen[row - 1][column + 1]) neighborCount++;
        }


        // Live cell with < 2 neighbors dies
        if (neighborCount < 2 && isAlive) {
            return false;
        }

            // Live cell with 2 neighbors lives
        else if (neighborCount == 2 && isAlive) {
            return true;
        }

            // Live cell with 3 neighbors lives
        else if (neighborCount == 3 && isAlive) {
            return true;
        }

            // Live cell with > 3 neighbors dies
        else if (neighborCount > 3 && isAlive) {
            return false;
        }

        // Dead cell with 3 live neighbors lives
        if ((neighborCount == 3) && !isAlive) {
            return true;
        }

        else {
            return false;
        }
    }

    function clearGrid() {
        for (var row = 0; row < numRows; row++) {
            for (var col = 0; col < numCols; col++) {
                currentGen[row][col] = false;
            }
        }
    }

    // Event Handlers
    $('#clearButton').click(function () {
        clearGrid();
        drawGeneration();
        generation = 0;
    });

    $('#crossButton').click(function () {
        clearGrid();
        for (var col = 0; col < numCols; col++) {
            currentGen[101][col] = true;
        }

        for (var row = 0; row < numRows; row++) {
            currentGen[row][101] = true;
        }

        drawGeneration();
        generation = 0;
    });

    $('#lineButton').click(function () {
        clearGrid();

        for (var col = 0; col < numCols; col++) {
            currentGen[101][col] = true;
        }


        drawGeneration();
        generation = 0;
    });

    $('#randomButton').click(function () {
        for (var row = 0; row < numRows; row++) {
            for (var col = 0; col < numCols; col++) {
                currentGen[row][col] = (Math.floor((Math.random() * 10) + 1) & 1);
            }
        }
        drawGeneration();
        generation = 0;
    });

    $('#startButton').click(function () {

        generateNextGen();

        if (myTimer) {

            clearInterval(myTimer);
            myTimer = null;
            $('#startButton').text('Start').button("refresh");
        }
        else {
            myTimer = setInterval(generateNextGen, 10);
            $('#startButton').text('Pause').button("refresh");
        }


    });

    $('#gameCanvas').click(function (e) {

        // get mouse click position
        var mx = e.offsetX;
        var my = e.offsetY;

        // calculate grid square numbers
        var gx = ~~(mx / size);
        var gy = ~~(my / size);

        // make sure we're in bounds
        if (gx < 0 || gx >= numCols || gy < 0 || gy >= numRows) {
            return;
        }

        if (currentGen[gy][gx]) {
            currentGen[gy][gx] = false;
            fill('lightgray', gx, gy);
        } else {
            currentGen[gy][gx] = true;
            fill('black', gx, gy);
        }
    });
})();
