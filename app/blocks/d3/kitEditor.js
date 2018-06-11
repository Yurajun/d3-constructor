/* global angular */

module.exports = ['d3Factory', '$q', '$window', '$compile',
	function (d3Factory, $q, $window, $compile){ // eslint-disable-line no-unused-vars

		// DDO - Directive Definetion Object
		return {
			scope: true,
			restrict: 'A',

			// $scope - модель директивы
			// $element - DOM-элемент с директивой, обернут в jqLite
			// $attrs - массив атрибуттов в DOM-элементе
			link: ($scope, $element, $attrs) => { // eslint-disable-line no-unused-vars
				// сработает когда загрузится d3. Фунция синхронной загрузки
				d3Factory.d3().then(function (d3){
					const DURATION = 800;
					/**
					 * Перемещение рабочей области в указанную точку
					 * @param  {Object} pt  -  точка назначения
					 * @param {Number} pt.x -  X - координаты
					 * @param {Number} pt.y -  Y - координаты
					 * @return {Promise}
					 */
					$scope.translateTo = pt => {
						const d = $q.defer();
						d.notify('About to start translate');

						// безымянная анимация
						d3.transition()
							.duration(DURATION)
							.tween('translateTo', () => {

								function translateToInternal(x, y){
									$scope.editor.behavior.d3.zoom.translate([x, y]);
									$scope.editor.behavior.d3.zoom.event($scope.editor.svg.container);
									$scope.editor.position.x = x;
									$scope.editor.position.y = y;
								}
								// 16,6 ms
								// здесь нужно вернуть фукцию инторполятор
								const step = d3.interpolate([$scope.editor.position.x, $scope.editor.position.y],
									[pt.x, pt.y]);
								// step(0)[0] -> $scope.editor.position.x
								// step(0)[1] -> $scope.editor.position.y
								// step(1)[0] -> pt.x
								// step(1)[1] -> pt.y
								// t -> [0, 1]

								// У возвращаемой фукции должен быть один параметер Т
								return t => {
									translateToInternal(step(t)[0], step(t)[1]);
								};
							}).each('end', () => {
								d.resolve(`Translate to (${pt.x}; ${pt.y}) succesfully`);
							});
						return d.promise;
					};

					$scope.center = () => {
						console.log('1');

						const scale        = $scope.editor.behavior.d3.zoom.scale();
						const editorWidth  = $scope.editor.pageProperties.pageWidth * scale;
						const editorHeight = $scope.editor.pageProperties.pageHeight * scale;
						const center = {
							x: ($window.innerWidth - editorWidth) / 2,
							y: ($window.innerHeight - editorHeight) / 2
						};

						// $scope.translateTo({x: 200, y: 300}).then(result => {
						// 	console.log(result);
						// });
						$scope.translateTo(center);
					};

					$scope.editor = {
						behavior: {
							d3: {
								drag: {
									dragging: false
								}
							}
						},
						position: {
							x: 0,
							y: 0
						},
						grid: {
							sizeXmm: 20,
							sizeYmm: 20
						},
						pageProperties: {},
						svg: {},
						features: {}
					};

					// console.log(d3.select($element[0]));
					/* home work lesson 3
					d3.select($element[0]).append('button').text('R')
						.attr('class', 'to-center-btn')
						.on('click', () => {
							const gridRect = $scope.editor.svg.container.node().getBoundingClientRect();

							const posX = ($window.innerWidth - gridRect.width) / 2;
							const posY = ($window.innerHeight - gridRect.height) / 2;

							// console.log($scope.editor);
							$scope.editor.svg.container
								.transition()
								.duration(DURATION)
								.attr('transform', `translate(${posX}, ${posY})scale(${$scope.editor.scale})`)
								.each('end', () => {
									$scope.editor.behavior.d3.zoom.translate([posX, posY]);
									$scope.editor.behavior.d3.zoom.event($scope.editor.svg.container);
								});
						});
					*/
					$scope.editor.svg.rootNode = d3.select($element[0]).append('svg')
						.attr('id', 'svg-editor');
					// console.log($scope.editor.svg.rootNode.node().pixelUnitToMillimeterX);
					// $scope.editor.features.pixelsPerMmX = 1 / $scope.editor.svg.rootNode.node().screenPixelToMillimeterX;
					// $scope.editor.features.pixelsPerMmY = 1 / $scope.editor.svg.rootNode.node().screenPixelToMillimeterY;
					// так как свойство в мм не работает то сделаем квадрат в мм и получим его размер в px

					/*
					const conversionRect = $scope.editor.svg.rootNode.append('rect')
																	.attr('width', '1mm')
																	.attr('height', '1mm');
					$scope.editor.features.pixelsPerMmX = conversionRect.node().getBBox().width;
					$scope.editor.features.pixelsPerMmY = conversionRect.node().getBBox().height;

					conversionRect.remove();
					*/

					const g = $scope.editor.svg.rootNode.append('g')
						.attr('transform', 'translate(0,0)');

					$scope.editor.svg.underlay = g.append('rect')
						.attr('class', 'underlay')
						.attr('width', '100%')
						.attr('height', '100%');

					$scope.editor.svg.container = g.append('g')
						.attr('class', 'svg-container');

					const gGridX = $scope.editor.svg.container.append('g')
						.attr('class', 'x axis');

					const gGridY = $scope.editor.svg.container.append('g')
						.attr('class', 'y axis');

					const borderFrame = $scope.editor.svg.container.append('rect')
						.attr('class', 'svg-border')
						.attr('x', 0)
						.attr('y', 0)
						.attr('width', 0)
						.attr('height', 0);

					// const A4WidthMm = 297;
					// const A4HeightMm = 210;
					// const pageWidth = A4WidthMm * $scope.editor.features.pixelsPerMmX;
					// const pageHeight = A4HeightMm * $scope.editor.features.pixelsPerMmY;

					$scope.editor.pageProperties.pageWidth = 1040;
					$scope.editor.pageProperties.pageHeight = 760;

					const pageWidth = $scope.editor.pageProperties.pageWidth;
					const pageHeight = $scope.editor.pageProperties.pageHeight;

					borderFrame
						.transition()
						.duration(DURATION)
						.attr('width', pageWidth)
						.attr('height', pageHeight);

					const linesX = gGridX.selectAll('line')
						.data(d3.range(0, pageHeight, 20));

					linesX.enter().append('line')
						.attr('x1', 0)
						.attr('x2', 0)
						.attr('y1', d => {return d;})
						.transition()
						.duration(DURATION)
						.attr('y2', d => {return d;})
						.attr('x2', pageWidth);

					const linesY = gGridY.selectAll('line')
						.data(d3.range(0, pageWidth, 20));

					linesY.enter().append('line')
						.attr('y1', 0)
						.attr('y2', 0)
						.attr('x1', d => {return d;})
						.transition()
						.duration(DURATION)
						.attr('x2', d => { return d;})
						.attr('y2', pageHeight);

					$scope.editor.behavior.d3.zoom = d3.behavior.zoom()
						.scaleExtent([0.2, 10])
						.on('zoom', function (){
							let t = d3.event.translate;

							$scope.editor.svg.container
								.attr('transform', 'translate(' + t + ')scale(' + d3.event.scale + ')');
							t = t.toString().split(','); // "1, 2" --> [1, 2]

							$scope.editor.position.x = t[0];
							$scope.editor.position.y = t[1];
							$scope.editor.scale = d3.event.scale;

						});
					g.call($scope.editor.behavior.d3.zoom);
					$scope.editor.behavior.d3.zoom.event($scope.editor.svg.container);
					$scope.center();

					// $compile(angular.element($scope.editor.svg.container.append('g')
					// 	.attr('transform', 'translate(0, 0)')
					// 	.attr('data-kit-custom-shape', '')
					// 	.attr('data-kit-rect', '').node()))($scope);

					// $compile(angular.element($scope.editor.svg.container.append('g')
					// 	.attr('transform', 'translate(0, 60)')
					// 	.attr('data-kit-custom-shape', '')
					// 	.attr('data-kit-rect', '').node()))($scope);

					// $compile(angular.element($scope.editor.svg.container.append('g')
					// 	.attr('transform', 'translate(0, 120)')
					// 	.attr('data-kit-custom-shape', '')
					// 	.attr('data-kit-t', '').node()))($scope);

					$compile(angular.element($scope.editor.svg.container.append('g')
						.attr('transform', 'translate(40, 280)')
						.attr('data-kit-custom-shape', '')
						.attr('data-kit-gear', '').node()))($scope);

					for (let i = 0; i < 10; i++){
						$compile(angular.element($scope.editor.svg.container.append('g')
						.attr('transform', `translate(${40 + i}, ${280 + i})`)
						.attr('data-kit-custom-shape', '')
						.attr('data-kit-gear', '').node()))($scope);
					}

					// $compile(angular.element($scope.editor.svg.container.append('g')
					// 	.attr('transform', 'translate(40, 320)')
					// 	.attr('data-kit-custom-shape', '')
					// 	.attr('data-kit-gear', '').node()))($scope);

					// $compile(angular.element($scope.editor.svg.container.append('g')
					// 	.attr('transform', 'translate(40, 420)')
					// 	.attr('data-kit-custom-shape', '')
					// 	.attr('data-kit-triangle', '').node()))($scope);

					// $compile(angular.element($scope.editor.svg.container.append('g')
					// 	.attr('transform', 'translate(160, 500)')
					// 	.attr('data-kit-custom-shape', '')
					// 	.attr('data-kit-screw', '').node()))($scope);

				});
			}
		};
	}];
