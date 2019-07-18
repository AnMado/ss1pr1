"use strict";

function extending(A, M){ //расширение матрицы до квадратной, с размером степени 2ки
	M = Math.pow(2, Math.ceil(Math.log2(M)));
	for (var i = 0; i < A.length; i++){
		for(var j = A[i].length; j < M; j++){
			A[i].push(0);
		}
	}
	for (var i = A.length; i < M; i++){
		var str = [];
		for(var j = 0; j < M; j ++){
			str.push(0);
		}
		A.push(str);
	}
	return A;
}

function sum(A, B, sign){ //Сложение и вычитание двух матриц
	var C = new Array(A.length);
	for (var i = 0; i < A.length; i++){
		C[i] = new Array(A.length);
		for(var j = 0; j < A.length; j++){
			C[i][j] = (+A[i][j]) + Math.pow(-1, sign) * (+B[i][j]);
		}
	}
	return C;
}
function concatArr(A, B, C, D, n, m){ //Сборка матрицы из блоков
	var k = A.length;
	var C = new Array(n);
	for (var i = 0; i < n; i++){
		C[i] = new Array(m);
		for (var j = 0; j < m; j++){
			if (i < k && j < k){ C[i][j] = A[i][j]; }
			else if (i < k) { C[i][j] = B[i][j - k]; }
			else if (j < k) { C[i][j] = C[i - k][j]; }
			else { C[i][j] = D[i - k][j - k]; }
		}
	}
	return C;
}
function product(A, B){ //Обычное перемножение
	var C = new Array(A.length);
	for (var i = 0; i < A.length; i++){
		C[i] = new Array(B[0].length);
		for (var j = 0; j < B[0].length; j++){
			C[i][j] = 0;
			for (var k = 0; k < B.length; k++){
				C[i][j] += (+A[i][k]) * (+B[k][j]);
			}
		}
	}
	return C;
}
function productSh(A, B, strNum, colNum){//Алгоритм Штрассена
	var M = A.length;
	var A11 = A.slice(0, M / 2); A11.forEach(function(el, id) {this[id] = el.slice(0, M / 2);}, A11); 
	var B11 = B.slice(0, M / 2); B11.forEach(function(el, id) {this[id] = el.slice(0, M / 2);}, B11);
	var A21 = A.slice(M / 2, M); A21.forEach(function(el, id) {this[id] = el.slice(0, M / 2);}, A21);
	var B21 = B.slice(M / 2, M); B21.forEach(function(el, id) {this[id] = el.slice(0, M / 2);}, B21);
	var A22 = A.slice(M / 2, M); A22.forEach(function(el, id) {this[id] = el.slice(M / 2, M);}, A22);
	var A12 = A.slice(0, M / 2); A12.forEach(function(el, id) {this[id] = el.slice(M / 2, M);}, A12);
	var B22 = B.slice(M / 2, M); B22.forEach(function(el, id) {this[id] = el.slice(M / 2, M);}, B22);
	var B12 = B.slice(0, M / 2); B12.forEach(function(el, id) {this[id] = el.slice(M / 2, M);}, B12); 

	var P1 = product(sum(A11, A22, 0), sum(B11, B22, 0));
	var P2 = product(sum(A21, A22, 0), B11);
	var P3 = product(A11, sum(B12, B22, 1));
	var P4 = product(A22, sum(B21, B11, 1));
	var P5 = product(sum(A11, A12, 0), B22);
	var P6 = product(sum(A21, A11, 1), sum(B11, B12, 0));
	var P7 = product(sum(A12, A22, 1), sum(B21, B22, 0));

	var C11 = sum(sum(P4, P5, 1), sum(P1, P7, 0), 0);
	var C12 = sum(P3, P5, 0);
	var C21 = sum(P2, P4, 0);
	var C22 = sum(sum(P1, P2, 1), sum(P3, P6, 0), 0);
	return concatArr(C11, C12, C21, C22, strNum, colNum);
}

function productChain(start, end){//перемножение цепочки матриц
		var A = arrOfMatr[start];
		var B = arrOfMatr[end];
		if (start == end) return A;
		else if (end - start == 1){
			var M = Math.max(A.length, B[0].length, B.length);
			if (M < 4){
				 return product(A, B)
			}else{
				var strNum = A.length;
				var colNum = B[0].length;
				return productSh(extending(A, M), extending(B, M), strNum, colNum);
			}
		}
		else return product(productChain(start, s[start][end]), productChain(s[start][end] + 1, end));
}

function Det(A){ // Поиск определителя методом Гаусса
	var answer = 1;
	for (var i = 0; i < A.length; i++){
		for (j = i + 1; j < A.length; j++){
			if (A[j][i] != 0){
				var coef = A[j][i];
				for (k = i; k < A.length; k++){
					A[j][k] -= A[i][k] * coef / A[i][i];
				}
			}
		}
		answer *= A[i][i];
	}
	return answer;
}


var arrOfMatr = new Array();
var flag = true;
do{ // Ввод
	alert("Ввод новой матрицы!");
	var Matr = new Array();
	while (true){
		var str = prompt("Введите строку матрицы");
		if (str == '\\\\' || str == '//') break;
		Matr.push(str.split(' '));
	}
	arrOfMatr.push(Matr);
	var N = arrOfMatr.length;
	if ((N > 1) && arrOfMatr[N - 2][0].length != arrOfMatr[N - 1].length)
		flag = false;
}while (str != '\\\\');

var m = new Array(N); // m[i][j] - минимальное количество умножений для A[i]....A[j]
var s = new Array(N); // s[i][j] - значение k - индекса матрицы перед скобкой, при котором достигается минимальное количество умножений A[i]...A[j]
if (flag){ //Тело программы
	for (var i = 0; i < N; i++){ 
		m[i] = new Array(N);
		m[i][i] = 0;
		s[i] = new Array(N);
	}
	for (var l = 1; l < N; l++){ //Будем перебирать всемозвожные цепочки длины l + 1
		for (var i = 0; i < N - l; i++){ //перебор по началу цепочки
			var j = i + l;
			m[i][j] = Infinity;
			for (var k = i; k < j; k++){
				var q = m[i][k] + m[k + 1][j] + arrOfMatr[i].length * arrOfMatr[k][0].length * arrOfMatr[j][0].length;
				if (q < m[i][j]){
					m[i][j] = q;
					s[i][j] = k;
				}
			}
		}
	}
	var resultMatr = productChain(0, N - 1);
	alert(resultMatr.join("\n"));
	if (resultMatr.length == resultMatr[0].length) alert(Det(resultMatr));
	else alert('Матрица не квадратная, детерминант не определен.');
}else{
	alert("Несовместимость размеров, перемножение невозможно!");
}
