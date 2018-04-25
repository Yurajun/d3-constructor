module.exports = ['d3Factory', '$q', '$window',
	function (d3Factory, $q, $window){ // eslint-disable-line no-unused-vars

		// DDO - Directive Definetion Object
		return {
			scope: true,
			restrict: 'A',

			// $scope - модель директивы
			// $element - DOM-элемент с директивой, обернут в jqLite
			// $attrs - массив атрибуттов в DOM-элементе
			link: ($scope, $element, $attrs) => { // eslint-disable-line no-unused-vars
				d3Factory.d3().then(function (d3){

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
							sizeXmm: 5,
							sizeYmm: 5
						},
						svg: {},
						features: {}
					};

					$scope.editor.svg.rootNode = d3.select($element[0]).append('svg')
						.attr('id', 'svg-editor');

					// $scope.editor.features.pixelsPerMmX = 1 / $scope.editor.svg.rootNode.node().screenPixelToMillimeterX;
					// $scope.editor.features.pixelsPerMmY = 1 / $scope.editor.svg.rootNode.node().screenPixelToMillimeterY;

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

					const DURATION = 800;
					borderFrame
						.transition()
						.duration(DURATION)
						.attr('width', 1035)
						.attr('height', 765);

					const linesX = gGridX.selectAll('line')
						.data(d3.range(0, 765, 15));

					linesX.enter().append('line')
						.attr('x1', 0)
						.attr('x2', 0)
						.attr('y1', function (d) {return d;})
						.transition()
						.duration(DURATION)
						.attr('y2', function (d) { return d;})
						.attr('x2', 1035);

					const linesY = gGridY.selectAll('line')
						.data(d3.range(0, 1035, 15));

					linesY.enter().append('line')
						.attr('y1', 0)
						.attr('y2', 0)
						.attr('x1', function (d) {return d;})
						.transition()
						.duration(DURATION)
						.attr('x2', function (d) { return d;})
						.attr('y2', 765);

					$scope.editor.behavior.d3.zoom = d3.behavior.zoom()
						.scaleExtent([0.2, 10])
						.on('zoom', function (){
							let t = d3.event.translate;

							$scope.editor.svg.container
								.attr('transform', 'translate(' + t + ')scale(' + d3.event.scale + ')');
							t = t.toString().split(','); // "1, 2" --> [1, 2]

							$scope.editor.position.x = t[0];
							$scope.editor.position.y = t[1];
						});
					g.call($scope.editor.behavior.d3.zoom);
					$scope.editor.behavior.d3.zoom.event($scope.editor.svg.container);
				});
			}
		};
	}];
