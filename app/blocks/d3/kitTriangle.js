module.exports = ['d3Factory',
	function (d3Factory){ // eslint-disable-line no-unused-vars

		// DDO - Directive Definetion Object
		return {
			scope: true,
			restrict: 'A',
			priority: 2,

			// $scope - модель директивы
			// $element - DOM-элемент с директивой, обернут в jqLite
			// $attrs - массив атрибуттов в DOM-элементе
			link: ($scope, $element, $attrs) => { // eslint-disable-line no-unused-vars

				d3Factory.d3().then(function (){
					$scope.shape.moniker = 'core.triangle';

					function drawTriangle(holeRadius, hHoleCount, vHoleCount){
						const width      = 10 * hHoleCount * 4;
						const height     = 10 * vHoleCount * 4;
						let borderRadius = 2 * holeRadius * 4;
						const stepH      = width / hHoleCount;
						const stepW      = height / vHoleCount;
						let pathString   = '';
						const angle45 = Math.PI / 4;
						/*
						pathString = `M0, ${borderRadius}
													a${borderRadius},${borderRadius} 0 0 1 ${borderRadius}, ${-borderRadius}
													h${width - (2 * borderRadius)}
													a${borderRadius},${borderRadius} 0 0 1 ${borderRadius}, ${borderRadius}
													v${height - (2 * borderRadius)}
													a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius}, ${borderRadius}
													a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius * Math.cos(angle45)}, ${-borderRadius * Math.sin(1 - angle45)}
													L${borderRadius - borderRadius * Math.cos(angle45)}, ${(2 * borderRadius) - borderRadius * Math.sin(1 - angle45)}
													a${borderRadius},${borderRadius} 0 0 1 ${-(borderRadius - borderRadius * Math.cos(angle45))}, ${-borderRadius * Math.sin(angle45)}
													z`;
						*/
						pathString = `M0, ${borderRadius}
													a${borderRadius},${borderRadius} 0 0 1 ${borderRadius}, ${-borderRadius}
													h${width - (2 * borderRadius)}
													a${borderRadius},${borderRadius} 0 0 1 ${borderRadius}, ${borderRadius}
													v${height - (2 * borderRadius)}
													a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius}, ${borderRadius}
													a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius * Math.SQRT1_2}, ${-borderRadius * Math.sin(1 - angle45)}
													L${borderRadius - borderRadius * Math.SQRT1_2}, ${(2 * borderRadius) - borderRadius * Math.sin(1 - angle45)}
													a${borderRadius},${borderRadius} 0 0 1 ${-(borderRadius - borderRadius * Math.SQRT1_2)}, ${-borderRadius * Math.SQRT1_2}
													z`;

						borderRadius /= 2;

						for (let j = 0; j < vHoleCount; j++){
							for (let i = 0; i < hHoleCount; i++){
								if (j === 0 || i === (hHoleCount - 1) || (j & 1) === 1 && (i & 1) === 1 && j === i || (j & 1) === 0 && (i & 1) === 0 && j === i){
									pathString += `M${i * stepH + stepH / 2},${j * stepW + stepW / 2 - borderRadius}
																a${borderRadius},${borderRadius} 0 0 1 0, ${2 * borderRadius}
																a${borderRadius},${borderRadius} 0 0 1 0, ${-2 * borderRadius}
																z`;
								// }else if ((j & 1) === 1 && (i & 1) === 1 && j === i){
								// 	pathString += `M${i * stepH + stepH / 2},${j * stepW + stepW / 2 - borderRadius}
								// 								a${borderRadius},${borderRadius} 0 0 1 0, ${2 * borderRadius}
								// 								a${borderRadius},${borderRadius} 0 0 1 0, ${-2 * borderRadius}
								// 								z`;
								// }else if ((j & 1) === 0 && (i & 1) === 0 && j === i){
								// 	pathString += `M${i * stepH + stepH / 2},${j * stepW + stepW / 2 - borderRadius}
								// 								a${borderRadius},${borderRadius} 0 0 1 0, ${2 * borderRadius}
								// 								a${borderRadius},${borderRadius} 0 0 1 0, ${-2 * borderRadius}
								// 								z`;
								}
							}
						}
						return pathString;
					}

					$scope.shape.svg.shapeObject = $scope.shape.svg.d3Object.append('path')
						.attr('d', drawTriangle(2.5, 4, 4));

				});
			}
		};
	}
];
