import type { PortfolioStory } from '$lib/i18n.svelte';

export class PortfolioGalleryState {
	private i18n!: any;
	private readonly BATCH_SIZE = 12;

	activeFilter = $state<string>('all');
	activeStory = $state<PortfolioStory | null>(null);
	activePhotoIndex = $state<number>(0);
	visibleCount = $state(18);
	sentinelEl = $state<HTMLElement | null>(null);

	private touchStartX = 0;
	private touchEndX = 0;

	constructor(i18n: any) {
		this.i18n = i18n;
	}
	
	get allStories(): PortfolioStory[] {
		return this.i18n.content.portfolio.items;
	}

	// Filters are edited in Sanity (Портфолио → Фильтры); "all" is always first.
	get filterOptions(): { id: string; label: string }[] {
		const portfolio = this.i18n.content.portfolio;
		return [{ id: 'all', label: portfolio.texts.allFilter }, ...portfolio.filters];
	}

	filteredStories = $derived(
		this.activeFilter === 'all'
			? this.allStories
			: this.allStories.filter(
					(s) => s.city === this.activeFilter || s.location.toLowerCase().includes(this.activeFilter)
			  )
	);

	displayedStories = $derived(this.filteredStories.slice(0, this.visibleCount));
	hasMore = $derived(this.visibleCount < this.filteredStories.length);

	currentStoryImages = $derived.by(() => {
		if (!this.activeStory) return [];
		if (this.activeStory.images && this.activeStory.images.length > 0) {
			return this.activeStory.images;
		}
		return [this.activeStory.src];
	});

	currentPhoto = $derived(
		this.currentStoryImages[this.activePhotoIndex] || this.activeStory?.src || ''
	);

	initPaginationReset() {
		$effect(() => {
			void this.activeFilter;
			this.visibleCount = 18;
		});
	}

	initObserver() {
		$effect(() => {
			if (!this.sentinelEl || !this.hasMore) return;

			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0]?.isIntersecting) {
						this.visibleCount = Math.min(this.visibleCount + this.BATCH_SIZE, this.filteredStories.length);
					}
				},
				{ rootMargin: '400px' }
			);

			observer.observe(this.sentinelEl);
			return () => observer.disconnect();
		});
	}

	openStory = (story: PortfolioStory) => {
		this.activeStory = story;
		this.activePhotoIndex = 0;
	};

	/** The lightbox walks through the stories of the chosen filter, not the whole portfolio. */
	private get navStories(): PortfolioStory[] {
		const list = this.filteredStories;
		return list.some((s) => s.id === this.activeStory?.id) ? list : this.allStories;
	}

	private neighbour(step: 1 | -1): PortfolioStory | null {
		const list = this.navStories;
		if (!this.activeStory || list.length === 0) return null;
		const idx = list.findIndex((s) => s.id === this.activeStory?.id);
		return list[(idx + step + list.length) % list.length];
	}

	private static imagesOf(story: PortfolioStory): string[] {
		return story.images && story.images.length > 0 ? story.images : [story.src];
	}

	prevPhoto = () => {
		if (!this.activeStory) return;
		if (this.activePhotoIndex > 0) {
			this.activePhotoIndex -= 1;
			return;
		}
		const prev = this.neighbour(-1);
		if (!prev) return;
		this.activeStory = prev;
		this.activePhotoIndex = PortfolioGalleryState.imagesOf(prev).length - 1;
	};

	nextPhoto = () => {
		if (!this.activeStory) return;
		if (this.activePhotoIndex < this.currentStoryImages.length - 1) {
			this.activePhotoIndex += 1;
			return;
		}
		const next = this.neighbour(1);
		if (!next) return;
		this.activeStory = next;
		this.activePhotoIndex = 0;
	};

	prevStoryDirect = () => {
		const prev = this.neighbour(-1);
		if (!prev) return;
		this.activeStory = prev;
		this.activePhotoIndex = 0;
	};

	nextStoryDirect = () => {
		const next = this.neighbour(1);
		if (!next) return;
		this.activeStory = next;
		this.activePhotoIndex = 0;
	};

	handleImageTouchStart = (e: TouchEvent) => {
		if (e.touches.length !== 1) return;
		this.touchStartX = e.touches[0].clientX;
		this.touchEndX = e.touches[0].clientX;
	};

	handleImageTouchEnd = (e: TouchEvent) => {
		if (e.changedTouches.length !== 1) return;
		this.touchEndX = e.changedTouches[0].clientX;
		const diff = this.touchEndX - this.touchStartX;

		if (Math.abs(diff) > 40) {
			if (diff < 0) {
				this.nextPhoto();
			} else {
				this.prevPhoto();
			}
		}
	};

	handleKeydown = (e: KeyboardEvent) => {
		if (!this.activeStory) return;
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			this.prevPhoto();
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			this.nextPhoto();
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			this.activeStory = null;
		}
	};

	selectForBooking = (story: PortfolioStory | null, setOpen: (val: boolean) => void) => {
		setOpen(false);
		this.activeStory = null;
		setTimeout(() => {
			if (story?.location) {
				const cityField = document.getElementById('city') as HTMLInputElement | null;
				if (cityField && !cityField.value) {
					cityField.value = story.location;
				}
			}
			document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
		}, 150);
	};
}

export function createPortfolioGallery(i18n: any) {
	const state = new PortfolioGalleryState(i18n);
	state.initPaginationReset();
	state.initObserver();
	return state;
}
