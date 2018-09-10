var searchProf = "";
///https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadJSON(callback, url) {
	var xobj = new XMLHttpRequest;
	xobj.overrideMimeType("application/json");
	xobj.open("GET", url, true);
	xobj.onreadystatechange = function() {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}
var myObj, profObj;
loadJSON(function(response) {
	myObj = JSON.parse(response);
}, "MEdata.json");
loadJSON(function(response) {
	profObj = JSON.parse(response);
}, "MEprofdata.json");
function init() {
	setTimeout(function() {
		next();
	}, 1000);
}
function UIsetup() {
	var profList = [""];
	for (var r = 0; r < myObj.SemesterList.length; r++) {
		(function(r) {
			for (var k = 0; k < myObj.SemesterList[r].SemesterData.length; k++) {
				(function(k) {
					for (var j = 0; j < myObj.SemesterList[r].SemesterData[k].ClassIDlist.length; j++) {
						(function(j) {
							var profName = myObj.SemesterList[r].SemesterData[k].ClassIDlist[j].Instructor.split(/& /g);
							for (var i = 0; i < profName.length; i++) {
								if (!profList.includes(profName[i].replace(/\s+$/, ""))) {
									profList.push(profName[i].replace(/\s+$/, ""));
								}
							}
						})(j);
					}
				})(k);
			}
		})(r);
	}
	profList = profList.sort();
	for (var v = 0; v < profList.length; v++) {
		var option = document.createElement("option");
		option.innerHTML = profList[v];
		option.value = profList[v];
		document.getElementById("profMenu").appendChild(option);
	}
	var classList = [""];
	for (var r = 0; r < myObj.SemesterList.length; r++) {
		(function(r) {
			for (var j = 0; j < myObj.SemesterList[r].SemesterData.length; j++) {
				(function(j) {
					var className = myObj.SemesterList[r].SemesterData[j].ClassName;
					if (!classList.includes(className.replace(/\s+$/, ""))) {
						classList.push(className.replace(/\s+$/, ""));
					}
				})(j);
			}
		})(r);
	}
	classList = classList.sort();
	for (var v = 0; v < classList.length; v++) {
		var option = document.createElement("option");
		option.innerHTML = classList[v];
		option.value = classList[v];
		document.getElementById("classMenu").appendChild(option);
	}
}
setTimeout(function() {
	UIsetup();
}, 1000);
init();
function indexOfCaseInsenstive(a, b) {
	a = a.toLowerCase();
	b = b.toLowerCase();
	return a.indexOf(b);
}
var constrainList = [];
var careerSearch = ["Undergraduate"];
var semesterSearch = ["Spring 2018", "Fall 2018"];
var classSearch = "";
function createConstraint() {
	var classCount = 0;
	var count = 0;
	for (var r = 0; r < myObj.SemesterList.length; r++) {
		(function(r) {
			for (var k = 0; k < myObj.SemesterList[r].SemesterData.length; k++) {
				(function(k) {
					for (var j = 0; j < myObj.SemesterList[r].SemesterData[k].ClassIDlist.length; j++) {
						(function(j) {
							classCount = "r" + r + "k" + k;
							var profName = myObj.SemesterList[r].SemesterData[k].ClassIDlist[j].Instructor;
							var careerName = myObj.SemesterList[r].SemesterData[k].Career;
							var semesterName = myObj.SemesterList[r].Semester;
							var className = myObj.SemesterList[r].SemesterData[k].ClassName;
							var careerContinues = false;
							for (var i = 0; i < careerSearch.length; i++) {
								if (careerName == careerSearch[i]) {
									careerContinues = true;
								}
							}
							var semesterContinues = false;
							for (var i = 0; i < semesterSearch.length; i++) {
								if (semesterName == semesterSearch[i]) {
									semesterContinues = true;
								}
							}
							var checkElective = checkIsElective(parseInt(className.substring(3, 8)));
							var meElectiveContinues = false;
							var meElectiveC = document.getElementById("meElective");
							var designElectiveContinues = false;
							var designElectiveC = document.getElementById("designElective");
							if (!meElectiveC.checked) {
								meElectiveContinues = true;
							} else {
								if (checkElective.value == 1) {
									meElectiveContinues = true;
									if (designElectiveC.checked) {
										designElectiveContinues = true;
									}
								}
							}
							if (!designElectiveC.checked) {
								designElectiveContinues = true;
							} else {
								if (checkElective.value == 2) {
									meElectiveContinues = true;
									designElectiveContinues = true;
								}
							}
							if (indexOfCaseInsenstive(profName, searchProf) > -1 & careerContinues & semesterContinues & designElectiveContinues & meElectiveContinues & indexOfCaseInsenstive(className, classSearch) > -1) {
								constrainList.push("classContainer" + classCount);
								count = "r" + r + "k" + k + "j" + j;
								constrainList.push("sectionContainer" + count);
							}
						})(j);
					}
				})(k);
			}
		})(r);
	}
}
function createDivs() {
	if (!document.getElementById("searchContainer")) {
		var searchNode = document.createElement("div");
		searchNode.id = "searchContainer";
		document.getElementsByTagName("body")[0].appendChild(searchNode);
	} else {
		var searchNode = document.getElementById("searchContainer");
	}
	var totalNum = 0;
	var classCount = 0;
	var count = 0;
	for (var r = 0; r < myObj.SemesterList.length; r++) {
		(function(r) {
			for (var k = 0; k < myObj.SemesterList[r].SemesterData.length; k++) {
				totalNum++;
				(function(k) {
					classCount = "r" + r + "k" + k;
					var node = document.createElement("div");
					node.classList.add("classContainer");
					var filterClass = myObj.SemesterList[r].SemesterData[k].ClassName.replace(/ /g, "").replace(/-/g, "").replace("/", "").replace(")", "").replace("(", "").replace(",", "").replace(":", "").replace("&", "").replace("'", "");
					node.classList.add(filterClass);
					node.id = "classContainer" + classCount;
					if (constrainList.includes("classContainer" + classCount)) {
						for (var j = 1; j <= 5 + 4; j++) {
							if (j == 7 - 3 || j == 9 - 3 || j == 11 - 3) {
								var ele = "div";
							} else {
								var ele = "li";
							}
							var textnode = document.createElement(ele);
							node.appendChild(textnode);
						}
						var superNode = document.createElement("div");
						superNode.id = "totalContainer" + classCount;
						superNode.classList.add(totalNum);
						superNode.appendChild(node);
						searchNode.appendChild(superNode);
						for (var i = 0; i < myObj.SemesterList[r].SemesterData[k].ClassIDlist.length; i++) {
							(function(i) {
								count = "r" + r + "k" + k + "j" + i;
								if (constrainList.includes("sectionContainer" + count)) {
									var sectionNode = document.createElement("div");
									sectionNode.classList.add("sectionContainer");
									sectionNode.id = "sectionContainer" + count;
									superNode.appendChild(sectionNode);
									for (var j = 1; j <= 11 * 2; j++) {
										if (j <= 7 || j >= 15 && j <= 17 + 1) {
											var ele = "div";
										} else {
											var ele = "li";
										}
										var textnode = document.createElement(ele);
										sectionNode.appendChild(textnode);
									}
								}
							})(i);
						}
					}
				})(k);
			}
		})(r);
	}
	for (var v = 0; v < document.getElementsByClassName("classContainer").length; v++) {
		var duplicate = document.getElementsByClassName("classContainer")[v].classList[1];
		if (document.querySelectorAll("." + duplicate).length > 1) {
			for (var u = 1; u < document.querySelectorAll("." + duplicate).length; u++) {
				(function(u) {
					for (var z = 1; z < document.querySelectorAll("." + duplicate)[u].parentElement.children.length; z++) {
						(function(z) {
							var c = document.querySelectorAll("." + duplicate)[u].parentElement.children[z];
							if (c) {
								document.querySelectorAll("." + duplicate)[0].parentElement.appendChild(c);
							}
							var d = document.querySelectorAll("." + duplicate)[u].parentElement;
							if (z == document.querySelectorAll("." + duplicate)[u].parentElement.children.length) {
								setTimeout(function() {
									d.innerHTML = "";
								}, 10 * (v + 1));
							}
						})(z);
					}
				})(u);
			}
		}
	}
	setTimeout(function() {
		for (var v = 0; v < document.getElementsByClassName("classContainer").length; v++) {
			var duplicate = document.getElementsByClassName("classContainer")[v].classList[1];
			if (document.querySelectorAll("." + duplicate).length > 1) {
				for (var u = 1; u < document.querySelectorAll("." + duplicate).length; u++) {
					(function(u) {
						for (var z = 1; z < document.querySelectorAll("." + duplicate)[u].parentElement.children.length; z++) {
							(function(z) {
								var c = document.querySelectorAll("." + duplicate)[u].parentElement.children[z];
								if (c) {
									document.querySelectorAll("." + duplicate)[0].parentElement.appendChild(c);
								}
								var d = document.querySelectorAll("." + duplicate)[u].parentElement;
								if (z == document.querySelectorAll("." + duplicate)[u].parentElement.children.length) {
									setTimeout(function() {
										d.innerHTML = "";
									}, 10 * (v + 1));
								}
							})(z);
						}
					})(u);
				}
			}
		}
	}, 800);
	var classList = [];
	setTimeout(function() {
		for (var v = 0; v < document.getElementsByClassName("classContainer").length; v++) {
			var className = document.getElementsByClassName("classContainer")[v].getElementsByTagName("li")[0].textContent;
			if (!classList.includes(className.replace(/\s+$/, ""))) {
				classList.push(className.replace(/\s+$/, ""));
			}
		}
		var count = 0;
		while (count != classList.length) {
			for (var v = 0; v < document.getElementsByClassName("classContainer").length; v++) {
				var className = document.getElementsByClassName("classContainer")[v].getElementsByTagName("li")[0].textContent.replace(/\s+$/, "");
				if (className == classList.sort()[count]) {
					var target = document.getElementsByClassName("classContainer")[v].getElementsByTagName("li")[0].parentElement.parentElement;
					var node = document.getElementsByClassName("classContainer")[count].getElementsByTagName("li")[0].parentElement.parentElement;
            //https://stackoverflow.com/questions/10716986/swap-2-html-elements-and-preserve-event-listeners-on-them
					target.nextSibling === node ? node.parentNode.insertBefore(target, node.nextSibling) : node.parentNode.insertBefore(target, node);
					count++;
					break;
				}
			}
		}
	}, 1000);
}
function obtainString(r, k, j) {
	var path = [myObj.SemesterList[r].SemesterData[k].ClassName, myObj.SemesterList[r].SemesterData[k].Career, myObj.SemesterList[r].SemesterData[k].Unit.replace(/units/g, "Credits"), myObj.SemesterList[r].SemesterData[k].Requirement, myObj.SemesterList[r].SemesterData[k].Description, myObj.SemesterList[r].SemesterData[k].Textbook, myObj.SemesterList[r].SemesterData[k].ClassIDlist[j].ClassID, myObj.SemesterList[r].SemesterData[k].ClassIDlist[j].Section, myObj.SemesterList[r].SemesterData[k].ClassIDlist[j].Schedule.replace(/& /g, 
  "<br>"), myObj.SemesterList[r].SemesterData[k].ClassIDlist[j].Room.replace(/& /g, "<br>"), myObj.SemesterList[r].SemesterData[k].ClassIDlist[j].Instructor.replace(/& /g, "<br>"), myObj.SemesterList[r].SemesterData[k].ClassIDlist[j].Date, myObj.SemesterList[r].SemesterData[k].ClassIDlist[j].Mode, myObj.SemesterList[r].Semester, myObj.SemesterList[r].SemesterData[k].ClassIDlist[j].Capacity, myObj.SemesterList[r].SemesterData[k].ClassIDlist[j].Rerollment, myObj.SemesterList[r].SemesterData[k].ClassIDlist[j].AvailableSeat];
	return path;
}
function next() {
	createConstraint();
	createDivs();
	var pathText = ["Requirement", "Description", "Textbook", "ClassID", "Section", "Schedule", "Room", "Instructor", "Date", "Mode", "Semester", "Capacity", "Rerollment", "AvailableSeat"];
	var count = 0;
	var titleEnd = 6;
	for (var r = 0; r < myObj.SemesterList.length; r++) {
		(function(r) {
			for (var k = 0; k < myObj.SemesterList[r].SemesterData.length; k++) {
				(function(k) {
					var path = obtainString(r, k, 0);
					classCount = "r" + r + "k" + k;
					if (constrainList.includes("classContainer" + classCount)) {
						for (var i = 0; i < titleEnd; i++) {
							assignedID = "classContainer" + classCount;
							var ii = i;
							document.getElementById(assignedID).getElementsByTagName("li")[ii].innerHTML = path[i];
							if (i == 0) {
								var isElective = checkIsElective(parseInt(path[i].substring(3, 8)));
								if (isElective.value > 0) {
									var prefix = "<code class='electiveTag " + isElective["class"] + "'>" + isElective.name + "</code> ";
									document.getElementById(assignedID).getElementsByTagName("li")[ii].innerHTML = path[i] + prefix;
								}
							}
							if (i >= 3 || i == titleEnd - 1) {
								var ii = i - 3;
								document.getElementById(assignedID).getElementsByTagName("div")[ii].innerHTML = pathText[i - 3];
							}
						}
						for (var j = 0; j < myObj.SemesterList[r].SemesterData[k].ClassIDlist.length; j++) {
							(function(j) {
								count = "r" + r + "k" + k + "j" + j;
								if (constrainList.includes("sectionContainer" + count)) {
									for (var i = titleEnd; i < pathText.length + 3; i++) {
										sectionAssignedID = "sectionContainer" + count;
										var ii = i - 6;
										var path = obtainString(r, k, j);
										document.getElementById(sectionAssignedID).getElementsByTagName("li")[ii].innerHTML = path[i];
										document.getElementById(sectionAssignedID).getElementsByTagName("div")[ii].innerHTML = pathText[i - 3];
										if (i == 10 & indexOfCaseInsenstive(path[i], "Staff") == -1) {
											var tempName = path[i].split(" <br>");
											var lastString = "";
											for (var vv = 0; vv < tempName.length; vv++) {
												for (var rr = 0; rr < profObj.ProfList.length; rr++) {
													if (tempName[vv] == profObj.ProfList[rr].name) {
														var ccnylink = profObj.ProfList[rr].ccnylink == "N/A" ? "" : '<a href="' + profObj.ProfList[rr].ccnylink + '" target="_blank">ccnylink</a>  ';
														var rmplink = profObj.ProfList[rr].rmplink == "N/A" ? "" : '<a href="' + profObj.ProfList[rr].rmplink + '" target="_blank">rmplink</a>  ';
														var extraBr = rr < profObj.ProfList.length ? "<br>" : "";
														lastString = lastString + tempName[vv] + "<br>" + ccnylink + rmplink + extraBr;
														break;
													}
												}
											}
											if (lastString == "") {
												var lastString = path[i];
											}
											document.getElementById(sectionAssignedID).getElementsByTagName("li")[ii].innerHTML = lastString;
										}
										var semesterNode = 7;
										if (path[i - 3] == "Fall 2018") {
											document.getElementById(sectionAssignedID).getElementsByTagName("li")[semesterNode].style.backgroundColor = "#d35400";
										} else {
											if (path[i - 3] == "Summer 2018") {
												document.getElementById(sectionAssignedID).getElementsByTagName("li")[semesterNode].style.backgroundColor = "#f1c40f";
											} else {
												document.getElementById(sectionAssignedID).getElementsByTagName("li")[semesterNode].style.backgroundColor = "#2ecc71";
											}
										}
									}
								}
							})(j);
						}
					}
				})(k);
			}
		})(r);
	}
}
var ME_Elective = [40100, 46300, 56300, 46700, 47000, 52600, 53600, 59500, 59901];
var Design_Elective = [44100, 46600, 46800, 46900, 47100, 51100, 51400, 51500, 53700, 53800, 53900, 54200, 54600, 54700, 54800, 55500, 55600, 57100, 57200, 54100];
function checkIsElective(courseID) {
	if (ME_Elective.indexOf(courseID) > -1) {
		return {value:1, name:"ME elective", "class":"meElective"};
	} else {
		if (Design_Elective.indexOf(courseID) > -1) {
			return {value:2, name:"Design elective", "class":""};
		} else {
			if (courseID > 59000 && courseID < 59109) {
				return {value:1, name:"ME elective", "class":"meElective"};
			} else {
				if (courseID > 59800 && courseID < 59909) {
					return {value:1, name:"ME elective", "class":"meElective"};
				} else {
					return {value:-1, name:"", "class":""};
				}
			}
		}
	}
}
function changeText(object, id) {
	document.getElementById(id).value = object.value;
}
function clearContent() {
	var myNode = document.getElementById("searchContainer");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
	constrainList = [];
}
function startSearch() {
	document.getElementById("searchBox").style.display = "none";
	setTimeout(function() {
		document.getElementById("searchBox").style.display = "";
	}, 1000);
	clearContent();
	searchProf = document.getElementById("profName").value;
	classSearch = document.getElementById("className").value;
	careerSearch = [];
	semesterSearch = [];
	var allSemester = 3;
	for (var i = 0; i < allSemester; i++) {
		var s = document.getElementById("semester" + (i + 1));
		if (s.checked) {
			semesterSearch.push(s.name);
		}
	}
	var allCareer = 2;
	for (var i = 0; i < allCareer; i++) {
		var c = document.getElementById("career" + (i + 1));
		if (c.checked) {
			careerSearch.push(c.name);
		}
	}
	init();
}
;