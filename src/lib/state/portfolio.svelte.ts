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

	currentStoryIndex = $derived(
		this.activeStory ? this.allStories.findIndex((s) => s.id === this.activeStory?.id) : -1
	);

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

	prevPhoto = () => {
		if (!this.activeStory) return;
		if (this.activePhotoIndex > 0) {
			this.activePhotoIndex -= 1;
		} else {
			const currentIdx = this.allStories.findIndex((s) => s.id === this.activeStory?.id);
			const prevStoryIdx = currentIdx > 0 ? currentIdx - 1 : this.allStories.length - 1;
			const prevStoryItem = this.allStories[prevStoryIdx];
			const prevImages =
				prevStoryItem.images && prevStoryItem.images.length > 0
					? prevStoryItem.images
					: [prevStoryItem.src];
			this.activeStory = prevStoryItem;
			this.activePhotoIndex = prevImages.length - 1;
		}
	};

	nextPhoto = () => {
		if (!this.activeStory) return;
		const totalPhotos = this.currentStoryImages.length;
		if (this.activePhotoIndex < totalPhotos - 1) {
			this.activePhotoIndex += 1;
		} else {
			const currentIdx = this.allStories.findIndex((s) => s.id === this.activeStory?.id);
			const nextStoryIdx = currentIdx < this.allStories.length - 1 ? currentIdx + 1 : 0;
			const nextStoryItem = this.allStories[nextStoryIdx];
			this.activeStory = nextStoryItem;
			this.activePhotoIndex = 0;
		}
	};

	prevStoryDirect = () => {
		if (!this.activeStory) return;
		const currentIdx = this.allStories.findIndex((s) => s.id === this.activeStory?.id);
		const prevStoryIdx = currentIdx > 0 ? currentIdx - 1 : this.allStories.length - 1;
		this.activeStory = this.allStories[prevStoryIdx];
		this.activePhotoIndex = 0;
	};

	nextStoryDirect = () => {
		if (!this.activeStory) return;
		const currentIdx = this.allStories.findIndex((s) => s.id === this.activeStory?.id);
		const nextStoryIdx = currentIdx < this.allStories.length - 1 ? currentIdx + 1 : 0;
		this.activeStory = this.allStories[nextStoryIdx];
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
