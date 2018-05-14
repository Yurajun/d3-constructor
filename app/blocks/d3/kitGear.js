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

				d3Factory.d3().then(function (d3){
					$scope.shape.moniker = 'core.gear';


					function drawGearWheel(teeth, radiusInner, radiusOuter, toothHeight) {

						const rOuter = Math.abs(radiusOuter) * 4;
						const rInner = Math.abs(radiusInner) * 4;
						const rTooth = rOuter + (toothHeight * 4);
						const step   = Math.PI / teeth;
						const s      = step / 3;
						let a0       = -Math.PI / 2;
						let i        = -1;
						// const pathString = ['M0', -rOuter];
						// const pathString = ['M0', rOuter * Math.sin(-90)];
						const pathString = ['M0', rOuter * Math.sin(a0)];
						while (++i < teeth){

							pathString.push('A', rOuter, ',', rOuter, ' 0 0 1 ', rOuter * Math.cos(a0 += step), ',', rOuter * Math.sin(a0));
							// 360 / (N + N) = 180 / N
							pathString.push('L', rTooth * Math.cos(a0 += s), ',', rTooth * Math.sin(a0));
							pathString.push('A', rTooth, ',', rTooth, ' 0 0 1 ', rTooth * Math.cos(a0 += s), ',', rTooth * Math.sin(a0));
							pathString.push('L', rOuter * Math.cos(a0 += s), ',', rOuter * Math.sin(a0));

						}

						pathString.push(
								'M0', -rInner,
								'A', rInner, ',', rInner, ' 0 0 0 0,', rInner,
								'A', rInner, ',', rInner, ' 0 0 0 0,', -rInner,
								'z'
							);

						return pathString.join('');
					}

					const outerAnnulus = d3.svg.arc()
						.innerRadius(10)
						.outerRadius(32)
						.startAngle(0)
						.endAngle(Math.PI * 2);

					const innerAnnulus = d3.svg.arc()
						.innerRadius(10)
						.outerRadius(20)
						.startAngle(0)
						.endAngle(Math.PI * 2);

					$scope.shape.svg.d3Object.append('path')
						.attr('class', 'gear-outer-circle')
						.attr('d', outerAnnulus);

					$scope.shape.svg.d3Object.append('path')
						.attr('class', 'gear-inner-circle')
						.attr('d', innerAnnulus);

					$scope.shape.svg.shapeObject = $scope.shape.svg.d3Object.append('path')
						.attr('class', 'gear')
						.attr('d', drawGearWheel(8, 5, 9, 2));

					// FPS / frame per second
					// jank-free
					// 60 FPS - 1000 / 60 ~ 16.6ms
					// requestAnimationFrame

					const speed = 0.05;      // gain
					const start = Date.now();

					d3.timer(() => {
						$scope.shape.svg.shapeObject.attr('transform', `rotate(${(Date.now() - start) * speed * ($scope.$id & 1 ? 1 : -1)})`);
					});

					// function drawRectWithHoles(holeRadius, hHoleCount, vHoleCount){

					// 	// const pathString = 'M0,0 L10,10';
					// 	const width      = 10 * hHoleCount * 4;
					// 	const height     = 10 * vHoleCount * 4;
					// 	let borderRadius = 2 * holeRadius * 4;
					// 	const stepH      = width / hHoleCount;
					// 	const stepW      = height / vHoleCount;
					// 	let pathString   = '';

					// 	pathString = `M${borderRadius},${height}
					// 								a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius}, ${-borderRadius}
					// 								v${-(height - 2 * borderRadius)}
					// 								a${borderRadius},${borderRadius} 0 0 1 ${borderRadius}, ${-borderRadius}
					// 								h${width - 2 * borderRadius}
					// 								a${borderRadius},${borderRadius} 0 0 1 ${borderRadius}, ${borderRadius}
					// 								v${height - 2 * borderRadius}
					// 								a${borderRadius},${borderRadius} 0 0 1 ${-borderRadius}, ${borderRadius}
					// 								z`;
					// 	borderRadius /= 2;
					// 	for (let j = 0; j < vHoleCount; j++){
					// 		for (let i = 0; i < hHoleCount; i++){
					// 			pathString += `M${i * stepH + stepH / 2},${j * stepW + stepW / 2 - borderRadius}
					// 										a${borderRadius},${borderRadius} 0 0 1 0, ${2 * borderRadius}
					// 										a${borderRadius},${borderRadius} 0 0 1 0, ${-2 * borderRadius}
					// 										z`;
					// 		}
					// 	}
					// 	return pathString;
					// }

					// $scope.shape.svg.shapeObject = $scope.shape.svg.d3Object.append('path')
					// 	.attr('d', drawRectWithHoles(2.5, 4, 1));

				});
			}
		};
	}
];
